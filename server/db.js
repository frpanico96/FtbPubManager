/**@frpanico
 * Main DB file
 * Connects to the database
 * Currently it is a local mongoDB database
 */
const Mongoose = require('mongoose');
require('dotenv').config();

const LOCAL_DB = process.env.DB_PATH;
//'mongodb://127.0.0.1:27017/ftbpubmanager';

const connectDb = async () => {
  await Mongoose.connect(LOCAL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('### MONGO_DB_CONNECTED ###');
};

module.exports = connectDb;
