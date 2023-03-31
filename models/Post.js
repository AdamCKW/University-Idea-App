const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
        likes: {
            type: Array,
            default: [],
        },
        dislikes: {
            type: Array,
            default: [],
        },
        isAuthHidden: {
            type: Boolean,
            default: false,
        },
        documents: [{ type: String }],
        images: [{ type: String }],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
        views: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.models.Post || mongoose.model('Post', postSchema);
