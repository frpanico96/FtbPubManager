/**@frpanico
 * Contact Us Service
 * Updates pub information
 */

const Pub = require('../model/Pub');

exports.updateContactInfo = async (req, res, next) => {
  const {phonePrefix, phoneNumber, email, pubId} = req.body;

  await Pub.findById(pubId)
    .then(pubToUpdate => {
      pubToUpdate.phone = phoneNumber;
      pubToUpdate.phonePrefix = phonePrefix;
      pubToUpdate.email = email;
      pubToUpdate
        .save()
        .then(newPub => {
          return res.status(200).json({message: 'Success', newPub});
        })
        .catch(error => {
          return res.status(400).json({message: 'Error', error: error.message});
        });
    })
    .catch(error => {
      return res.status(400).json({message: 'Error', error: error.message});
    });
};

exports.updateAddressInfo = async (req, res, next) => {
  const {address, pubId} = req.body;

  await Pub.findById(pubId)
    .then(pubToUpdate => {
      pubToUpdate.address = address;
      pubToUpdate
        .save()
        .then(newPub => {
          return res.status(200).json({message: 'Success', newPub});
        })
        .catch(error => {
          return res.status(400).json({message: 'Error', error: error.message});
        });
    })
    .catch(error => {
      return res.status(400).json({message: 'Error', error: error.message});
    });
};

exports.updateOpenCloseInfo = async (req, res, next) => {
  const {openTime, closeTime, pubId} = req.body;

  await Pub.findById(pubId)
    .then(pubToUpdate => {
      pubToUpdate.openTime = openTime;
      pubToUpdate.closeTime = closeTime;
      pubToUpdate
        .save()
        .then(newPub => {
          return res.status(200).json({message: 'Success', newPub});
        })
        .catch(error => {
          return res.status(400).json({message: 'Error', error: error.message});
        });
    })
    .catch(error => {
      return res.status(400).json({message: 'Error', error: error.message});
    });
};

exports.updateVacationInfo = async (req, res, next) => {
  const {vacationStart, vacationEnd, vacationReason, pubId} = req.body;

  await Pub.findById(pubId)
    .then(pubToUpdate => {
      pubToUpdate.vacationStart = vacationStart;
      pubToUpdate.vacationEnd = vacationEnd;
      pubToUpdate.vacationReason = vacationReason;
      pubToUpdate
        .save()
        .then(newPub => {
          return res.status(200).json({message: 'Success', newPub});
        })
        .catch(error => {
          console.log(error);
          return res.status(400).json({message: 'Error', error: error.message});
        });
    })
    .catch(error => {
      return res.status(400).json({message: 'Error', error: error.message});
    });
};

exports.updateReservationInfo = async (req, res, next) => {
  const {reservationDelay, showOwner, daysClosed, phoneNumberRequired, pubId} =
    req.body;

  await Pub.findById(pubId)
    .then(pubToUpdate => {
      pubToUpdate.reservationDelay = reservationDelay;
      pubToUpdate.showOwner = showOwner;
      pubToUpdate.daysClosed = daysClosed;
      pubToUpdate.phoneNumberRequired = phoneNumberRequired;
      pubToUpdate
        .save()
        .then(newPub => {
          return res.status(200).json({message: 'Success', newPub});
        })
        .catch(error => {
          return res.status(400).json({message: 'Error', error: error.message});
        });
    })
    .catch(error => {
      return res.status(400).json({message: 'Error', error: error.message});
    });
};
