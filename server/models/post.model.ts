import { defineMongooseModel } from '#nuxt/mongoose'

export const Post = defineMongooseModel({
    name: 'Post',
    schema: {
        title: {
            type: 'string',
            required: true,
        },
        slug: {
            type: 'string',
            required: false,
        },
        category: {
            type: 'string',
            required: true,
            enum: ['news', 'promotion','policy'],
        },
        content: {
            type: 'string',
            required: false,
        },
        thumbnail: { // sửa đúng chính tả từ "thumnail" thành "thumbnail"
            type: 'string',
            required: false,
        },
        seo_title: {
            type: 'string',
            required: false,
        },
        seo_keywords: {
            type: 'string',
            required: false,
        },
        seo_content: {
            type: 'string',
            required: false,
        },
        updated_at: { // sửa đúng chính tả từ "update_at" thành "updated_at"
            type: Date,
            required: true,
        },
        show_in_home: {
            type: Boolean,
            required: false,
        },
        public: {
            type: Boolean,
            required: false,
        },
        created_at: { // sửa đúng chính tả từ "create_at" thành "created_at"
            type: Date,
            required: true,
        },
    },

})
