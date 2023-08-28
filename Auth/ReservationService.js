/**@frpanico
 * Reservation Service Api
 */

const Reservation = require('../model/Reservation');
const Contact = require('../model/contact');
//const Pub = require('../model/Pub');
const User = require('../model/User');

exports.getReservationByDate = async (req, res, next) => {
  const {date} = req.body;
  await Reservation.find({dateTimeOfReservation: date})
    .then(reservations => {
      return res.status(200).json({message: 'Success', reservations});
    })
    .catch(error => {
      return res.status(400).json({message: 'Error', error: error.message});
    });
};

exports.insertReservation = async (req, res, next) => {
  const {contactInfo, numberOfPeople, dateTimeOfReservation, pubId} = req.body;
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
