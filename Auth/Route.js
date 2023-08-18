/**@frpanico
 * Routing file
 */
const express = require('express');
const {adminAuth} = require('../middleware/auth');
const router = express.Router();
const {register, login, update, deleteUser} = require('./Auth');
const {insertPub, getAllPubs, updatePub, deletePub} = require('./PubService');
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/update').put(adminAuth, update);
router.route('/deleteUser').delete(adminAuth, deleteUser);
router.route('/createPub').post(insertPub);
router.route('/getPubs').get(getAllPubs);
router.route('/updatePub').put(adminAuth, updatePub);
router.route('/deletePub').delete(adminAuth, deletePub);
module.exports = router;
