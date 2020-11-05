const Patient = require('../models/patient');

exports.getAddPatient = (req, res, next) => {
    let message       = req.flash('error');

    if(message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    res.render('patient/add-patient', {
        pageTitle: 'Add Patient',
        path: '/',
        //errorMessage: message
    })
};

exports.postAddPatient = (req, res, next) => {
    const name         = req.body.name;
    const email        = req.body.email;
    const dateOfB      = req.body.dateOfB;
    const gender       = req.body.gender;

    Patient.findOne({email: email})
    .then(userDoc => {
        if(userDoc) {
            req.flash('error', 'E-Mail exists alredy, please pick a different one.');
            return res.redirect('/add-patient');
        }

        const patient = new Patient({
            name: name,
            email: email,
            dateOfB: dateOfB,
            gender: gender
        })

        return patient.save()
        .then(result => {
            console.log("PATIENT CREATED");
            res.redirect('/profile')
        })
        .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
};

exports.getPatients = (req, res, next) => {
    Patient.find()
    .then(patients => {
        res.render('patient/patients', {
            pageTitle: 'Patients',
            path: '/',
            patients: patients
        })
    })
    .catch(err => console.log(err));
};

exports.getEditPatient = (req, res, next) => {
    const patientId    = req.params.patientId;

    Patient.findById(patientId)
    .then(patient => {
        res.render('patient/edit-patient', {
            pageTitle: 'Edit Patient',
            path: '/',
            patient: patient
        })
    })
    .catch(err => console.log(err));
};

exports.postEditPatient = (req, res, next) => {
    const patientId     = req.body.patientId;
    const updatedName   = req.body.name;
    const updatedEmail  = req.body.email;

    Patient.findById(patientId)
    .then(patient => {
        patient.name    = updatedName;
        patient.email   = updatedEmail;
        return patient.save();
    })
    .then(result => {
        console.log("UPDATED PATRIENT");
        res.redirect('/patients');
    })
    .catch(err => console.log(err));
};

exports.getPatient = (req, res, next) => {
    const patientId = req.params.patientId;
    
    Patient.findById(patientId)
    .then(patient => {
        res.render('patient/patient', {
            pageTitle: 'Patient ' + patient.name,
            path: '/',
            patient: patient
        })
    })
    .catch(err => console.log(err));
};