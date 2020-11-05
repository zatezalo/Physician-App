const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adjustmentSchema = new Schema({
    cersyn: {
        type: String
    },
    cersag: {
        type: String
    },
    cermeth: {
        type: String
    },
    thoseg:{
        type: String
    },
    thometh:{
        type: String
    },
    pelcucdere:{
        type: String
    },
    lumseg:{
        type: String
    },
    dermeth:{
        type: String
    }
});

module.exports = mongoose.model('Adjustment', adjustmentSchema);