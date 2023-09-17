/**@frpanico
 * WorkingDay schema file
 * Allows to group reservations per day
 * It is currentyly defined by fields
 * -- date
 * -- pub
 * -- stopReservations
 * -- reservations
 */

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const WorkingDaySchema = new Mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  pub: {
    type: Schema.Types.ObjectId,
    ref: 'pub',
  },
  stopReservations: {
    type: Boolean,
    default: false,
  },
  reservations: [{type: Schema.Types.ObjectId, ref: 'reservation'}],
});

const WorkingDay = Mongoose.model('workingday', WorkingDaySchema);
module.exports = WorkingDay;
