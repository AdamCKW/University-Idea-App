const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const closureSchema = new Schema(
    {
        startDate: {
            type: Date,
            required: true,
        },
        initialClosureDate: {
            type: Date,
            required: true,
        },
        finalClosureDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.Closure || mongoose.model('Closure', closureSchema);
