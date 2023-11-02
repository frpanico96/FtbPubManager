/**@frpanico
 * Routing file
 */
const express = require('express');
const {
  adminAuth,
  ownerAuth,
  customerAuth,
  guestAuth,
} = require('../middleware/auth');
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
router.route('/createPub').post(adminAuth, insertPub);
router.route('/getPub').post(guestAuth, getPubById);
router.route('/getPubs').get(getAllPubs);
router.route('/updatePub').put(adminAuth, updatePub);
router.route('/deletePub').delete(adminAuth, deletePub);
/* Menu Api */
router.route('/getMenu').post(guestAuth, getMenu);
router.route('/createMenu').post(ownerAuth, insertMenuItem);
router.route('/updateMenu').post(ownerAuth, updateMenu);
/* Reservation Api */
router.route('/getReservation').post(ownerAuth, getReservationByDateAndPub);
router.route('/createReservation').post(customerAuth, insertReservation);
router.route('/updateReservation').post(customerAuth, updateReservation);
router
  .route('/updateReservationStatus')
  .post(ownerAuth, updateReservationStatus);
router
  .route('/getUserPubReservation')
  .post(customerAuth, getUserReservationByPubId);
router.route('/stopReservations').post(ownerAuth, stopReservations);
router.route('/getUserReservation').post(customerAuth, getUserReservation);
/* Contact Us Api */
router.route('/updateContactInfo').post(ownerAuth, updateContactInfo);
router.route('/updateAddressInfo').post(ownerAuth, updateAddressInfo);
router.route('/updateOpenCloseInfo').post(ownerAuth, updateOpenCloseInfo);
router.route('/updateVacationInfo').post(ownerAuth, updateVacationInfo);
router.route('/updateReservationInfo').post(ownerAuth, updateReservationInfo);
/* Review Api */
router.route('/getPubReviews').post(guestAuth, getReviewsByPub);
router.route('/getReviewComments').post(guestAuth, getReviewComments);
router.route('/addReview').post(customerAuth, insertReview);
router.route('/addReviewComment').post(customerAuth, commentReview);
router.route('/addReviewFeedback').post(customerAuth, reviewFeedback);
//router.route('/createFoodCategory').post(insertFoodCategory);
//router.route('/createFood').post(insertFood);
module.exports = router;
