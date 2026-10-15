"use strict";

require('dotenv').config(); 

// @ts-ignore
const stripe = require("stripe")(process.env.STRIPE_KEY);

import { factories } from '@strapi/strapi';
import { Context } from 'koa'; 
import type { Core } from '@strapi/strapi'; 

interface ProductRequest {
  id: number;
}

export default factories.createCoreController("api::order.order", ({ strapi }: { strapi: Core.Strapi }) => ({
    async create(ctx: Context) {
        // @ts-ignore
        const { products } = ctx.request.body as { products: ProductRequest[] };

        if (!products || !Array.isArray(products)) {
            ctx.response.status = 400;
            return { error: "La lista de productos es requerida." };
        }

        try {
            const lineItems = await Promise.all(
                products.map(async (product: ProductRequest) => {
                    
                    // Buscamos el producto usando la base de datos nativa por ID numérico plano
                    let item = await strapi.db.query("api::product.product").findOne({
                        where: { id: product.id }
                    });

                    if (!item) {
                        item = await strapi.db.query("api::product.products").findOne({
                            where: { id: product.id }
                        });
                    }

                    if (!item) {
                        throw new Error(`El producto con ID ${product.id} no existe en la base de datos de Strapi.`);
                    }

                    return {
                        price_data: {
                            currency: "mxn",
                            product_data: {
                                name: item.productName || item.name || "Producto"
                            },
                            unit_amount: Math.round(item.price * 100)
                        },
                        quantity: 1
                    };
                })
            );

            // Generamos la sesión limpia en Stripe (Cumpliendo las reglas del último SDK)
            const session = await stripe.checkout.sessions.create({
                shipping_address_collection: { allowed_countries: ["MX"] },
                mode: "payment", 
                success_url: `${process.env.CLIENT_URL}/success`,
                cancel_url: `${process.env.CLIENT_URL}/cart`,
                line_items: lineItems,
            });

            // CORREGIDO: Para evitar el error 500 al guardar en Strapi 5, guardamos el mapeo de IDs limpio
            const productIdsOnly = products.map(p => ({ id: p.id }));

            await strapi.documents("api::order.order").create({
                data: {
                    products: productIdsOnly, 
                    stripeId: session.id,
                    publishedAt: new Date() 
                },
                status: "published"
            });

            return { stripeSession: session };

        } catch (error: any) {
            console.log("¡CATCH DEL BACKEND DETECTADO!");
            console.error("EL ERROR REAL ES:", error);

            ctx.response.status = 500;
            return { error: error.message || "Error interno en el servidor de Stripe" };
        }
    },
}));

{/* 
    @ts-ignore
    const stripe = require("stripe")(process.env.STRIPE_KEY)
    
    * order controller

    const { createCoreController } = require("@strapi/strapi").factories;

    module.exports = createCoreController("api::order.order", ({ strapi }) => ({

        async create(ctx) {
            @ts-ignore

            const { products } = ctx.request.body;

            try {
                const lineItem = await Promise.all(
                    products.map(aync (product) => {
                        const item = await strapi
                         .service("api::product.product")
                         .findOne(product.id);

                         return {
                            price_data: {
                                currency: "eur",
                                product_data: {
                                    name: item.productName
                                },
                                unit_amount: Math.round(item.price * 100)
                            },

                            quantity: 1
                        }
                    })
                );

                const session = await stripe.checkout.sessions.create({
                    shipping_address_collection: {allowed_countries: ["ES"]},
                    payment_method_types: ["card"],
                    mode:"payment",
                    success_url: process.env.CLIENT_URL + "/success",
                    cancel_url: process.env.CLIENT_URL + "/sucessError",
                    line_items: lineItems,
                    
                });

              await strapi.service("api::order.order").create(data: { products, stripeId: session.id })  

              return { stripeSession: session };

            } catch (error) {
                ctx.response.status = 500;
                return {console.error(error)}

            }

        }

    }))

*/}