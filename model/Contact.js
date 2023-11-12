/**@frpanico
 * Contact schema file
 * Allows to handle Contact associated to user
 * Used to make reservations
 * It is currentyly defined by three fields
 * -- phoneNumber
 * -- phonePrefix
 * -- isGuest
 * -- user
 */

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const ContactSchema = new Mongoose.Schema({
  phoneNumber: {
    type: String,
    required: false,
    unique: false,
  },
  phonePrefix: {
    type: String,
    required: false,
    unique: false,
    default: '+39',
  },
  isGuest: {
    type: Boolean,
    required: true,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

const Contact = Mongoose.model('contact', ContactSchema);
module.exports = Contact;
