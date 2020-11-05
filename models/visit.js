const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const visitSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    adjustmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Adjustment',
        required: true,
    },
    visitDate: {
        type: Date,
        required: true
    },
    timeIn: {
        type: String,
        required: true
    },
    timeOut: {
        type: String,
        required: true
    },
    note: {
        type: String
    },
    pain: {
        type: String
    },
    assessment: {
        type: String
    },
    plan:{
        type: String
    }
});

module.exports = mongoose.model('Visit', visitSchema);