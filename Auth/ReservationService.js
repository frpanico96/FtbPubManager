/**@frpanico
 * Reservation Service Api
 */

const Reservation = require('../model/Reservation');
const Contact = require('../model/contact');
//const Pub = require('../model/Pub');
const User = require('../model/User');

exports.getReservationByDateAndPub = async (req, res, next) => {
  const {date, pubId} = req.body;
  console.log(new Date());
  const startDate = new Date(
    date.year + '-' + date.month + '-' + date.day + 'T00:00:00.000Z',
  );
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
  console.log(startDate);
  console.log(endDate);
  await Reservation.find({
    dateTimeOfReservation: {$gte: startDate, $lt: endDate},
    pub: pubId,
  })
    .populate('contact')
    .exec()
    .then(reservations => {
      return res.status(200).json({message: 'Success', reservations});
    })
    .catch(error => {
      return res.status(400).json({message: 'Error', error: error.message});
    });
};

exports.getUserReservationByPubId = async (req, res, next) => {
  const {username, pubId} = req.body;
  await User.findOne({username: username})
    .then(user => {
      Reservation.find({
        pub: pubId,
        contact: {$in: user.contacts},
      })
        .populate('contact', ['phoneNumber', 'phonePrefix', 'isGuest'])
        .exec()
        .then(reservations => {
          return res.status(200).json({message: 'Success', reservations});
        })
        .catch(error => {
          console.log(error);
          return res.status(400).json({message: 'Error', error: error.message});
        });
    })
    .catch(error => {
      console.log(error);
      return res.status(400).json({message: 'Error', error: error.message});
    });
};

exports.insertReservation = async (req, res, next) => {
  const {contactInfo, numberOfPeople, date, pubId} = req.body;
  const dateTimeOfReservation = date.dateStr;
  const validation = formValidation(
    contactInfo.username,
    dateTimeOfReservation,
    contactInfo.phoneNumber,
    contactInfo.phonePrefix,
    numberOfPeople,
  );
  if (validation?.error) {
    return res.status(400).json({
      message: 'Error',
      error: validation.error,
    });
  }
  await User.findOne({username: contactInfo.username})
    .then(user => {
      Contact.findOne({phoneNumber: contactInfo.phoneNumber})
        .then(result => {
          if (!result) {
            Contact.create({
              phoneNumber: contactInfo.phoneNumber,
              phonePrefix: contactInfo.phonePrefix,
              isGuest: contactInfo.isGuest,
              user: user._id,
            })
              .then(newContact => {
                user.contacts.push(newContact._id);
                user
                  .save()
                  .then(savedUser => {
                    Reservation.create({
                      numberOfPeople,
                      dateTimeOfReservation,
                      contact: newContact._id,
                      pub: pubId,
                    })
                      .then(newReservation => {
                        // Pub.findById(pubId)
                        // .then(pubToUpdate => {
                        //   pubToUpdate.reservations.push(newReservation._id);
                        // })
                        return res.status(200).json({
                          message: 'Success',
                          newReservation,
                        });
                      })
                      .catch(error =>
                        res.status(400).json({
                          message: 'Error',
                          error: error.message,
                        }),
                      );
                  })
                  .catch(error =>
                    res.status(400).json({
                      message: 'Error',
                      error: error.message,
                    }),
                  );
              })
              .catch(error =>
                res.status(400).json({message: 'Error', error: error.message}),
              );
          } else {
            Reservation.create({
              numberOfPeople,
              dateTimeOfReservation,
              contact: result._id,
              pub: pubId,
            })
              .then(newReservation => {
                // Pub.findById(pubId)
                // .then(pubToUpdate => {
                //   pubToUpdate.reservations.push(newReservation._id);
                // })
                return res.status(200).json({
                  message: 'Success',
                  newReservation,
                });
              })
              .catch(error =>
                res.status(400).json({
                  message: 'Error',
                  error: error.message,
                }),
              );
          }
        })
        .catch(error =>
          res.status(400).json({message: 'Error', error: error.message}),
        );
    })
    .catch(error =>
      res.status(400).json({message: 'Error', error: error.message}),
    );
};

exports.updateReservation = async (req, res, next) => {
  const {contactInfo, date, numberOfPeople, reservationId} = req.body;
  const dateTimeOfReservation = date.dateStr;
  const validation = formValidation(
    contactInfo.username,
    dateTimeOfReservation,
    contactInfo.phoneNumber,
    contactInfo.phonePrefix,
    numberOfPeople,
    true,
  );
  if (validation?.error) {
    return res.status(400).json({
      message: 'Error',
      error: validation.error,
    });
  }
  await Reservation.findById(reservationId)
    .then(reservationToUpdate => {
      Contact.findById(reservationToUpdate.contact)
        .then(contactToUpdate => {
          if (contactToUpdate.phoneNumber !== contactInfo.phoneNumber) {
            contactToUpdate.phoneNumber = contactInfo.phoneNumber;
            contactToUpdate
              .save()
              .then(newContact => {
                reservationToUpdate.dateTimeOfReservation =
                  dateTimeOfReservation;
                reservationToUpdate.numberOfPeople = numberOfPeople;
                reservationToUpdate
                  .save()
                  .then(newReservation => {
                    return res.status(200).json({
                      message: 'Success',
                      newReservation,
                    });
                  })
                  .catch(error =>
                    res.status(400).json({
                      message: 'Error',
                      error: error.message,
                    }),
                  );
              })
              .catch(error =>
                res.status(400).json({
                  message: 'Error',
                  error: error.message,
                }),
              );
          } else {
            reservationToUpdate.dateTimeOfReservation = dateTimeOfReservation;
            reservationToUpdate.numberOfPeople = numberOfPeople;
            reservationToUpdate
              .save()
              .then(newReservation => {
                return res.status(200).json({
                  message: 'Success',
                  newReservation,
                });
              })
              .catch(error =>
                res.status(400).json({
                  message: 'Error',
                  error: error.message,
                }),
              );
          }
        })
        .catch(error =>
          res.status(400).json({
            message: 'Error',
            error: error.message,
          }),
        );
    })
    .catch(error =>
      res.status(400).json({
        message: 'Error',
        error: error.message,
      }),
    );
};

exports.updateReservationStatus = async (req, res, next) => {
  const {status, callback, username, reservationId} = req.body;
  await Reservation.findById(reservationId)
    .then(reservationToUpdate => {
      if (reservationToUpdate.status !== 'booked') {
        return res.status(401).json({
          message: 'Error',
          error: 'It is not possible to modify a closed reservation',
        });
      } else {
        reservationToUpdate.status = status;
        reservationToUpdate.callBack = callback;
        reservationToUpdate
          .save()
          .then(newReservation => {
            User.findOne({username: username})
              .then(userToUpdate => {
                let score =
                  status === 'shown' ? 1 : status === 'not shown' ? -2 : 0;
                console.log(score);
                score += callback ? -1 : 0;
                userToUpdate.score = userToUpdate.score + score;
                userToUpdate
                  .save()
                  .then(newUser => {
                    return res.status(200).json({
                      message: 'Success',
                      newReservation,
                    });
                  })
                  .catch(error =>
                    res.status(400).json({
                      message: 'Error',
                      error: error.message,
                    }),
                  );
              })
              .catch(error =>
                res.status(400).json({
                  message: 'Error',
                  error: error.message,
                }),
              );
          })
          .catch(error =>
            res.status(400).json({
              message: 'Error',
              error: error.message,
            }),
          );
      }
    })
    .catch(error =>
      res.status(400).json({
        message: 'Error',
        error: error.message,
      }),
    );
};

function validateDate(dateStr) {
  const limitReservation = new Date();
  return !(new Date(dateStr) < limitReservation);
}

function validatePhoneNumber(phoneNumber) {
  const regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return regex.test(phoneNumber);
}

function formValidation(
  username,
  dateStr,
  phoneNumber,
  prefix,
  numberOfPeople,
  isUpdate = false,
) {
  let result = {};
  if (!username) {
    return {...result, error: 'Invalid username'};
  }
  if (!validateDate(dateStr) && !isUpdate) {
    return {...result, error: 'Date can not be in the past'};
  }
  if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
    return {...result, error: 'Invalid Phone Number'};
  }
  if (!prefix) {
    return {...result, error: 'Prefix must be indicated'};
  }
  if (!Number.isInteger(numberOfPeople) || numberOfPeople < 0) {
    return {...result, error: 'Invalid Number of people'};
  }
}
