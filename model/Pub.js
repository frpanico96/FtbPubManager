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
 * -- openTime
 * -- closeTime
 * -- daysClosed
 * -- vacationStart
 * -- vacationEnd
 * -- vactionReason
 * -- address
 * -- phone
 * -- email
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
  openTime: {
    type: String,
  },
  closeTime: {
    type: String,
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
  vactionReason: {
    type: String,
  },
  address: {
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
});

const Pub = Mongoose.model('pub', PubSchema);
module.exports = Pub;
