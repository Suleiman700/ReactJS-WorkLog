const mongoose = require("mongoose");

const WorkDaysSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    job_id: {
        type: String,
        required: true
    },
    start_hour: {
        type: String,
        required: true
    },
    end_hour: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    updated_at: {
        type: Date,
        required: true
    },
    remote_workday: {
        type: Boolean,
        required: true
    },
    note: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model("work_days", WorkDaysSchema);
