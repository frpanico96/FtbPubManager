/** @frpanico
 * Test Ping Api
 */
exports.testPing = async (req, res, next) => {
  console.log('### Pinging server');
  return res.status(200).json({message: 'Server pinged succesfully'});
};
