/**@frpanico
 * Pub schema file
 * Pub is the entity that the user interact with
 * It is currentyly defined by three fields
 * -- Name
 * -- Owner
 * -- Logo
 * -- ShowOwner (it is used to show or not the owner on the app)
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
  logo: {
    type: String,
    default: 'pub-default-btn',
  },
  showOwner: {
    type: Boolean,
    default: true,
  },
});

const Pub = Mongoose.model('pub', PubSchema);
module.exports = Pub;
