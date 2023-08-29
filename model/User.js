/**@frpanico
 * User Schema File
 * The user is the entity that interacts with the app
 * It is currentyly defined by three fields
 * -- Username
 * -- Password
 * -- Role
 * -- Pubs
 * -- Contacts
 */
const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    default: 'customer',
    required: true,
    enum: ['customer', 'owner', 'admin'],
  },
  pubs: [{type: Mongoose.Schema.Types.ObjectId, ref: 'pub'}],
  contacts: [{type: Mongoose.Schema.Types.ObjectId, ref: 'contact'}],
  score: {
    type: Number,
    default: 0,
  },
});

const User = Mongoose.model('user', UserSchema);
module.exports = User;
