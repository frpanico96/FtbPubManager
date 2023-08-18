/**@frpanico
 * Main Server file
 */
const express = require('express');
const connectDb = require('./db');
const cookieParser = require('cookie-parser');
const {adminAuth, userAuth} = require('../middleware/auth');
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', require('../Auth/Route'));

app.get('/admin', adminAuth, (req, res) => res.send('Admin Route'));
app.get('/customer', userAuth, (req, res) => res.send('User Route'));
const PORT = 5001;

const server = app.listen(PORT, () =>
  console.log(`Server connected to port ${PORT}`),
);

process.on('unhandledRejection', err => {
  console.log(`An error occured: ${err.message}`);
  server.close(() => process.exit());
});
console.log('### Connecting DB');
connectDb();
