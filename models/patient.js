const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dateOfB: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    referrals: {
        patients: [
            {
                patientId: {type: Schema.Types.ObjectId, ref:'Patient', requred: true},
                name: {type: String}
            }
        ]
    },
    notes: {
        visitNote: [
            {
                visitId: {type: Schema.Types.ObjectId, ref:'Visit', requred: true},
                note: {type: String}
            }
        ]
    },
    receptionists: {
        visitReceptionist: [
            {
                visitId: {type: Schema.Types.ObjectId, ref:'Visit', requred: true},
                receptionist: {type: String}
            }
        ]
    }
});

patientSchema.methods.addToNotes = function(note) {

    const noteIndex = this.notes.visitNote.findIndex(visitNote => {
        return visitNote.visitId.toString() === note.visitId.toString();
    })

    let updateNotes = [...this.notes.visitNote];

    if(noteIndex >= 0) {
        this.notes.visitNote[noteIndex].note = note.note;
    }
    else {
        updateNotes.push({
            visitId: note.visitId,
            note: note.note
        })
    }

    let notes = {
        visitNote: updateNotes
    }

    this.notes = notes;
    return this.save();
}

patientSchema.methods.addToReceptionists = function(receptionist) {

    const receptionistIndex = this.receptionists.visitReceptionist.findIndex(visitReceptionist => {
        return visitReceptionist.visitId.toString() === receptionist.visitId.toString();
    })

    let updateReceptionists = [...this.receptionists.visitReceptionist];

    if(receptionistIndex >= 0) {
        this.receptionists.visitReceptionist[receptionistIndex].receptionist = receptionist.receptionist;
    }
    else {
        updateReceptionists.push({
            visitId: receptionist.visitId,
            receptionist: receptionist.receptionist
        })
    }

    let receptionists = {
        visitReceptionist: updateReceptionists
    }

    this.receptionists = receptionists;
    return this.save();
}

module.exports = mongoose.model('Patient', patientSchema);