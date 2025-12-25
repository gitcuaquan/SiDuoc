import { defineMongooseModel } from '#nuxt/mongoose'
export const Cart = defineMongooseModel({
    name: 'Cart',
    schema: {
        user_id: {
            type: "string",
            required: true,
        },
        data: {
            type: "string",
            required: true,
        }
    }
})