const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const PubSchema = new Mongoose.Schema({
    name: {
      type: String,
      unique: true,
      required: true,
    },
    owner: {type: Schema.Types.ObjectId, ref: 'user'},
})


const Pub = Mongoose.model('pub', PubSchema);
module.exports = Pub;
