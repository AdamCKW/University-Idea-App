const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        isAuthHidden: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.Comment || mongoose.model('Comment', commentSchema);
