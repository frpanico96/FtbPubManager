/**@frpanico
 * Routing file
 */
const express = require('express');
const {adminAuth} = require('../middleware/auth');
const router = express.Router();
const {testPing} = require('./ConnectionTest');
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
  getUserReservation,
} = require('./ReservationService');
const {
  updateContactInfo,
  updateAddressInfo,
  updateOpenCloseInfo,
  updateVacationInfo,
  updateReservationInfo,
} = require('./ContacUsService');
const {
  getReviewsByPub,
  getReviewComments,
  insertReview,
  commentReview,
  reviewFeedback,
} = require('./ReviewService');

/* Test Ping */
router.route('/ping').get(testPing);
/* User Api */
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/update').put(adminAuth, update);
router.route('/deleteUser').delete(adminAuth, deleteUser);
router.route('/guestLogin').get(guestLogin);
/* Pub Api */
router.route('/createPub').post(insertPub);
router.route('/getPub').post(getPubById);
router.route('/getPubs').get(getAllPubs);
router.route('/updatePub').put(adminAuth, updatePub);
router.route('/deletePub').delete(adminAuth, deletePub);
/* Menu Api */
router.route('/getMenu').post(getMenu);
router.route('/createMenu').post(insertMenuItem);
router.route('/updateMenu').post(updateMenu);
/* Reservation Api */
router.route('/getReservation').post(getReservationByDateAndPub);
router.route('/createReservation').post(insertReservation);
router.route('/updateReservation').post(updateReservation);
router.route('/updateReservationStatus').post(updateReservationStatus);
router.route('/getUserPubReservation').post(getUserReservationByPubId);
router.route('/stopReservations').post(stopReservations);
router.route('/getUserReservation').post(getUserReservation);
/* Contact Us Api */
router.route('/updateContactInfo').post(updateContactInfo);
router.route('/updateAddressInfo').post(updateAddressInfo);
router.route('/updateOpenCloseInfo').post(updateOpenCloseInfo);
router.route('/updateVacationInfo').post(updateVacationInfo);
router.route('/updateReservationInfo').post(updateReservationInfo);
/* Review Api */
router.route('/getPubReviews').post(getReviewsByPub);
router.route('/getReviewComments').post(getReviewComments);
router.route('/addReview').post(insertReview);
router.route('/addReviewComment').post(commentReview);
router.route('/addReviewFeedback').post(reviewFeedback);
//router.route('/createFoodCategory').post(insertFoodCategory);
//router.route('/createFood').post(insertFood);
module.exports = router;
