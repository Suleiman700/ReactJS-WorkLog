const mongoose = require("mongoose");

const JobsSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    start_date: {
        type: String,
        required: false
    },
    active: {
        type: Boolean,
        required: true
    },
    hourly: {
        type: Number,
        required: true
    },
    break_time: {
        type: Number,
        required: true
    },
    exclude_break_time: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    created_at: {
        type: String,
        required: false
    },
    updated_at: {
        type: String,
        required: false
    },
});

// export model user with UserSchema
module.exports = mongoose.model("jobs", JobsSchema);
