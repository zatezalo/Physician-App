const express = require('express');

const visitController = require('../controllers/visits');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, visitController.getAllVisits);

router.get('/add-visit', isAuth, visitController.getAddVisit);

router.post('/add-visit', isAuth, visitController.postAddVisit);

router.get('/edit-visit/:visitId', isAuth, visitController.getEditVisit);

router.post('/edit-visit', isAuth, visitController.postEditVisit);

router.get('/enter-visit/:visitId', isAuth, visitController.getEnterVisit);

router.post('/enter-visit', isAuth, visitController.postEnterVisit);

router.get('/enter-objective/:visitId', isAuth, visitController.getEnterObjective);

router.get('/enter-objective/:visitId/subjective', isAuth, visitController.getEnterObjective);

router.get('/enter-objective/:visitId/adjustment', isAuth, visitController.getEnterObjective);

router.get('/enter-objective/:visitId/thoracic', isAuth, visitController.getEnterObjective);

router.get('/enter-objective/:visitId/lumbar', isAuth, visitController.getEnterObjective);

router.post('/enter-objective', isAuth, visitController.postEnterObjective);


module.exports = router;