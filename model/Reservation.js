/**@frpanico
 * Reservation schema file
 * Allows to handle reservation for a Pub
 * It is currentyly defined by three fields
 * -- phoneNumber
 * -- phonePrefix
 * -- isGuest
 * -- user
 */

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const ReservationSchema = new Mongoose.Schema({
  contact: {
    type: Schema.Types.ObjectId,
    ref: 'contact',
  },
  numberOfPeople: {
    type: Number,
    required: true,
  },
  dateTimeOfReservation: {
    type: Schema.Types.Date,
    required: true,
  },
  pub: {
    type: Schema.Types.ObjectId,
    ref: 'pub',
  },
});

const Reservation = Mongoose.model('reservation', ReservationSchema);
module.exports = Reservation;
