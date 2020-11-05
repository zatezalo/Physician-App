const express = require('express');

const patientController = require('../controllers/patient');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/patients', isAuth, patientController.getPatients);

router.get('/patients/:patientId', isAuth, patientController.getPatient);

router.get('/patients/edit/:patientId', isAuth, patientController.getEditPatient);

router.post('/patients/edit', isAuth, patientController.postEditPatient);

router.get('/add-patient', isAuth, patientController.getAddPatient);

router.post('/add-patient', isAuth, patientController.postAddPatient);

module.exports = router;