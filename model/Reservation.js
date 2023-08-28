/**@frpanico
 * Reservation schema file
 * Allows to handle reservation for a Pub
 * It is currentyly defined by three fields
 * -- contact
 * -- numberOfPeople
 * -- dateTimeOfReservation
 * -- pub
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
  status: {
    type: String,
    default: 'booked',
    enum: ['booked', 'cancelled', 'shown', 'not shown'],
  },
  callBack: {
    type: Boolean,
    default: false,
  },
});

const Reservation = Mongoose.model('reservation', ReservationSchema);
module.exports = Reservation;
