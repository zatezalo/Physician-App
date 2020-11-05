const Visit = require('../models/visit');
const Patient = require('../models/patient');
const Adjustment = require('../models/adjustment');
const url = require('url');
const split = require('split-string')


exports.getAllVisits = (req, res, next) => {
    Visit.find()
    .populate('patientId')
    .then(visits => {
        res.render('visit/visits', {
            pageTitle: 'Visits',
            path: '/schedule',
            visits: visits,
            //errorMessage: message
        })
    }).catch(err => console.log(err));
};

exports.getAddVisit = (req, res, next) => {
    Patient.find()
    .then(patients => {
        res.render('visit/add-visit', {
            pageTitle: 'Add Visit',
            path: '/sd',
            patients: patients,
            user: req.user
        })
    })
    .catch(err => console.log(err));
};

exports.postAddVisit = (req, res, next) => {
    const userId     = req.user._id;
    const visitDate  = req.body.date;
    const timeIn     = req.body.timeIn;
    const timeOut    = req.body.timeOut;
    const patientId  = req.body.patientId;

    const adjustment = new Adjustment({
        cersyn: '',
        cersag: '',
        cermeth: '',
        thoseg: '',
        thometh: '',
        pelcucdere: '',
        lumseg: '',
        dermeth: '',
    })
    adjustment.save();

    const visit = new Visit({
        userId: userId,
        patientId: patientId,
        adjustmentId: adjustment._id,
        visitDate: visitDate,
        timeIn: timeIn,
        timeOut: timeOut
    });
    visit.save();

    Patient.findById(patientId) 
    .then(patient => {
        patient.addToNotes({
            visitId: visit._id,
            note: ''
        })
        patient.addToReceptionists({
            visitId: visit._id,
            receptionist: ''
        })
    })

    .then(result => {
        console.log("VISIT CREATED");
        res.redirect('/schedule')
    })
    .catch(err => console.log(err));
};

exports.getEditVisit = (req, res, next) => {
    const visitId    = req.params.visitId;
    let string       = '';
    
    Visit.findById(visitId)
    .populate('patientId')
    .then(visit => {

        if(visit.visitDate.getMonth() < 10)
            string = '-0';
        else 
            string = '-';

        res.render('visit/edit-visit', {
            pageTitle: 'Edit Visit',
            path: '/',
            visit: visit,
            user: req.user,
            string: string
        })

    })
    .catch(err => console.log(err));
}

exports.postEditVisit = (req, res, next) => {
    const visitId           = req.body.visitId;
    const updatedTimeIn     = req.body.timeIn;
    const updatedTimeOut    = req.body.timeOut;
    const updatedVisitDate  = req.body.date;
    
    Visit.findById(visitId)
    .then(visit => {
        console.log(visit.timeIn, visit.timeOut, visit.visitDate);
        visit.timeIn        = updatedTimeIn;
        visit.timeOut       = updatedTimeOut;
        visit.visitDate     = updatedVisitDate;
        return visit.save();
    })
    .then(result => {
        console.log("UPDATED VISIT");
        res.redirect('/schedule');
    })
    .catch(err => console.log(err));
}

exports.getEnterVisit = (req, res, next) => {
    const visitId     = req.params.visitId;

    Visit.findById(visitId)
    .populate('patientId')
    .populate('userId')
    .then(visit => {

        if(visit.visitDate.getMonth()<10)
            string = '-0';
        else 
            string = '-';

        const receptionistIndex = visit.patientId.receptionists.visitReceptionist.findIndex(visitReceptionist => {
            return visitReceptionist.visitId.toString() === visitId.toString();
        })

        const noteIndex = visit.patientId.notes.visitNote.findIndex(visitNote => {
            return visitNote.visitId.toString() === visitId.toString();
        })

        Visit.find({ patientId: visit.patientId._id })
        .then(patientVisits => {
            res.render('visit/enter-visit', {
                pageTitle: 'Visit',
                path: '/schedule',
                visit: visit,
                string: string,
                patientVisits: patientVisits,
                noteIndex: noteIndex,
                receptionistIndex: receptionistIndex
                //errorMessage: message
            })
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}

exports.postEnterVisit = (req, res, next) => { 
    const visitId      = req.body.visitId;
    const note         = req.body.note;
    const receptionist = req.body.receptionist;
    const patientId    = req.body.patientId;
    
    Patient.findById(patientId)
    .then(patient => {
        patient.addToNotes({
            visitId: visitId,
            note: note
        })
        patient.addToReceptionists({
            visitId: visitId,
            receptionist: receptionist
        })
    })
    .then(result => {
        //console.log(result);
        res.redirect('/schedule/enter-visit/' + visitId);
    })
}

exports.getEnterObjective = (req, res, next) => {
    const visitId         = req.params.visitId;
    const urlObj          = url.parse(req.url, true);
    var urlString         = urlObj.href;
    const urlArr          = urlString.split('/');
    urlString             = urlArr[3];

    Visit.findById(visitId)
    .populate('patientId')
    .populate('userId')
    .populate('adjustmentId')
    .then(visit => {
        if(visit.visitDate.getMonth() < 10)
            string = '-0';
        else 
            string = '-';

        const noteIndex = visit.patientId.notes.visitNote.findIndex(visitNote => {
            return visitNote.visitId.toString() === visitId.toString();
        })

        Visit.find({ patientId: visit.patientId._id })
        .populate('userId')
        .populate('adjustmentId')
        .then(patientVisits => {
            if(urlString === undefined){
                urlString = 'notes';
                res.render('visit/enter-objective/notes-xray', {
                    pageTitle: 'Visit',
                    path: '/schedule',
                    visit: visit,
                    string: string,
                    patientVisits: patientVisits,
                    noteIndex: noteIndex,
                    urlString: urlString
                    //errorMessage: message
                })
            }
            else if(urlString.toString() === 'subjective'){
                res.render('visit/enter-objective/subjective', {
                    pageTitle: 'Visit',
                    path: '/schedule',
                    visit: visit,
                    string: string,
                    patientVisits: patientVisits,
                    noteIndex: noteIndex,
                    urlString: urlString
                    //errorMessage: message
                })
            }
            else if(urlString.toString() === 'adjustment'){
                res.render('visit/enter-objective/adjustment', {
                    pageTitle: 'Visit',
                    path: '/schedule',
                    visit: visit,
                    string: string,
                    patientVisits: patientVisits,
                    noteIndex: noteIndex,
                    urlString: urlString
                    //errorMessage: message
                })
            }
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}

exports.postEnterObjective = (req, res, next) => {
    const visitId            = req.body.visitId;
    const adjustmentId       = req.body.adjustmentId;

    //Subjective
    const pain               = req.body.pain;
    const assessment         = req.body.assessment;
    const plan               = req.body.plan;
    const note               = req.body.note;

    //Adjustment

    const cervSynd           = req.body.cervSynd;
    const cervicalVertebrals = req.body.cervicalVertebrals;
    const cervicalMethod     = req.body.cervicalMethod;

    const thoracicVertebrals = req.body.thoracicVertebrals;
    const thoracicMethod     = req.body.thoracicMethod;

    const derefield          = req.body.derefield;
    const lumbarVertebrals   = req.body.lumbarVertebrals;
    const lumbarMethod       = req.body.lumbarMethod;

    if(req.body.submit.toString() === 'saveSubjective') {
        Visit.findById(visitId)
        .then(visit => {
            visit.pain = pain;
            visit.assessment = assessment;
            visit.plan = plan;
            visit.note = note;
    
            visit.save()
        })
        .then(result => {
            res.redirect('/schedule/enter-objective/' + visitId + '/subjective');
        })
    } else if(req.body.submit.toString() === 'saveAdjustment') {
        Adjustment.findById(adjustmentId)
        .then(adjustment => {
            adjustment.cersyn       = cervSynd;
            adjustment.cersag       = cervicalVertebrals.toString();
            adjustment.cermeth      = cervicalMethod;
            adjustment.thoseg       = thoracicVertebrals.toString();
            adjustment.thometh      = thoracicMethod;
            adjustment.pelcucdere   = derefield;
            adjustment.lumseg       = lumbarVertebrals.toString();
            adjustment.dermeth      = lumbarMethod;
    
            adjustment.save()
        })
        .then(result => {
            res.redirect('/schedule/enter-objective/' + visitId + '/adjustment');
        })
    }
}
