const Mongoose = require('mongoose');

const LOCAL_DB = 'mongodb://127.0.0.1:27017/role_auth';

const connectDb = async () => {
  await Mongoose.connect(LOCAL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('### MONGO_DB_CONNECTED ###');
};

module.exports = connectDb;
