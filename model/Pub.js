/**@frpanico
 * Pub schema file
 * Pub is the entity that the user interact with
 * It is currentyly defined by three fields
 * -- Name
 * -- Owner
 * -- menu
 * -- Logo
 * -- ShowOwner (it is used to show or not the owner on the app)
 * -- reservations
 * -- workingdays
 * -- openTime
 * -- closeTime
 * -- daysClosed
 * -- vacationStart
 * -- vacationEnd
 * -- vactionReason
 * -- address
 * -- phonePrefix
 * -- phone
 * -- email
 * -- reservationDelay
 * -- phoneNumber required
 */
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const PubSchema = new Mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  owner: {type: Schema.Types.ObjectId, ref: 'user'},
  menu: [{type: Schema.Types.ObjectId, ref: 'menu'}],
  logo: {
    type: String,
    default: 'pub-default-btn',
  },
  showOwner: {
    type: Boolean,
    default: true,
  },
  reservations: [{type: Schema.Types.ObjectId, ref: 'reservation'}],
  workingdays: [{type: Schema.Types.ObjectId, ref: 'workingday'}],
  openTime: {
    type: Number,
  },
  closeTime: {
    type: Number,
  },
  daysClosed: {
    type: Array,
  },
  vacationStart: {
    type: Date,
  },
  vacationEnd: {
    type: Date,
  },
  vacationReason: {
    type: String,
  },
  address: {
    type: String,
  },
  phonePrefix: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  reservationDelay: {
    type: Number,
  },
  phoneNumberRequired: {
    type: Boolean,
    default: false,
  },
});

const Pub = Mongoose.model('pub', PubSchema);
module.exports = Pub;
