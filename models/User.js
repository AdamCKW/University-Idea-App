const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const maxDate = new Date().toISOString().split('T')[0];

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            min: '1900-01-01',
            max: maxDate,
        },
        department: {
            type: String,
        },
        role: {
            type: String,
            enum: ['staff', 'qaCoordinator', 'qaManager', 'admin'],
            default: 'staff',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
