/**@frpanico
 * Log Schema File
 * It is used to track log ins
 */

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const LogSchema = new Mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  isGuest: {
    type: Boolean,
    default: false,
  },
  method: {
    type: String,
  },
  timeStamp: {
    type: Schema.Types.Date,
    required: true,
  },
});

const Log = Mongoose.model('log', LogSchema);
module.exports = Log;
