/**@frpanico
 * Routing file
 */
const express = require('express');
const {adminAuth} = require('../middleware/auth');
const router = express.Router();
const {register, login, update, deleteUser, guestLogin} = require('./Auth');
const {
  insertPub,
  getPubById,
  getAllPubs,
  updatePub,
  deletePub,
} = require('./PubService');
const {getMenu, insertMenuItem, updateMenu} = require('./MenuService');
const {
  getReservationByDateAndPub,
  insertReservation,
  updateReservation,
  updateReservationStatus,
  getUserReservationByPubId,
  stopReservations,
} = require('./ReservationService');
const {
  updateContactInfo,
  updateAddressInfo,
  updateOpenCloseInfo,
  updateVacationInfo,
  updateReservationInfo,
} = require('./ContacUsService');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/update').put(adminAuth, update);
router.route('/deleteUser').delete(adminAuth, deleteUser);
router.route('/guestLogin').get(guestLogin);
router.route('/createPub').post(insertPub);
router.route('/getPub').post(getPubById);
router.route('/getPubs').get(getAllPubs);
router.route('/updatePub').put(adminAuth, updatePub);
router.route('/deletePub').delete(adminAuth, deletePub);
router.route('/getMenu').post(getMenu);
router.route('/createMenu').post(insertMenuItem);
router.route('/updateMenu').post(updateMenu);
router.route('/getReservation').post(getReservationByDateAndPub);
router.route('/createReservation').post(insertReservation);
router.route('/updateReservation').post(updateReservation);
router.route('/updateReservationStatus').post(updateReservationStatus);
router.route('/getUserReservation').post(getUserReservationByPubId);
router.route('/stopReservations').post(stopReservations);
router.route('/updateContactInfo').post(updateContactInfo);
router.route('/updateAddressInfo').post(updateAddressInfo);
router.route('/updateOpenCloseInfo').post(updateOpenCloseInfo);
router.route('/updateVacationInfo').post(updateVacationInfo);
router.route('/updateReservationInfo').post(updateReservationInfo);
//router.route('/createFoodCategory').post(insertFoodCategory);
//router.route('/createFood').post(insertFood);
module.exports = router;
