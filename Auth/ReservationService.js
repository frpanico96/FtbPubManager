/**@frpanico
 * Reservation Service Api
 */

const Reservation = require('../model/Reservation');
const Contact = require('../model/Contact');
const Pub = require('../model/Pub');
const User = require('../model/User');
const WorkingDay = require('../model/WorkingDay');

exports.getReservationByDateAndPub = async (req, res, next) => {
  const {date, pubId} = req.body;
  //console.log(date);
  const startDate = new Date(date);
  //startDate.setHours(0);
  // startDate.setMinutes(0);
  // startDate.setSeconds(0);
  startDate.setHours(0, 0, 0, 0);
  //console.log('StartDate', startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
  console.log('StartDate', startDate);
  console.log('EndDate', endDate);
  await WorkingDay.findOne({
    date: {$gte: startDate, $lt: endDate},
    pub: pubId,
  })
    .populate(
      {
        path: 'reservations',
        populate: [{path: 'contact', populate:[{path: 'user', select: 'username', strictPopulate: false}]}]
      }
    )
    .exec()
    .then(workday => {
      console.log(workday);
      return res.status(200).json({message: 'generic-success', workday});
    })
    .catch(error => {
      return res.status(400).json({message: 'generic-error', error: error.message});
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
        .populate({
          path: 'contact',
          select: 'phoneNumber phonePrefix isGuest',
          populate: [{path: 'user', select: 'username', strictPopulate: false}],
        })
        .exec()
        .then(reservations => {
          return res.status(200).json({message: 'generic-success', reservations});
        })
        .catch(error => {
          console.log(error);
          return res.status(400).json({message: 'generic-error', error: error.message});
        });
    })
    .catch(error => {
      console.log(error);
      return res.status(400).json({message: 'generic-error', error: error.message});
    });
};

exports.getUserReservation = async (req, res, next) => {
  const {username} = req.body;
  console.log(username);
  await User.findOne({username})
    .then(user => {
      console.log(user);
      Reservation.find({
        contact: {$in: user.contacts},
      })
        .populate({
          path: 'contact pub',
          select: 'phoneNumber phonePrefix isGuest name',
          populate: [{path: 'user', select: 'username', strictPopulate: false}],
        })
        .exec()
        .then(reservations => {
          return res.status(200).json({message: 'generic-success', reservations});
        })
        .catch(error => {
          console.log(error);
          return res.status(400).json({message: 'generic-error', error: error.message});
        });
    })
    .catch(error => {
      console.log(error);
      return res.status(400).json({message: 'generic-error', error: error.message});
    });
};

exports.insertReservation = async (req, res, next) => {
  const {contactInfo, numberOfPeople, dateTimeOfReservation, pubId} = req.body;
  const validation = formValidation(
    contactInfo.username,
    dateTimeOfReservation,
    contactInfo.phoneNumber,
    contactInfo.phonePrefix,
    numberOfPeople,
  );
  console.log(dateTimeOfReservation);
  if (validation?.error) {
    return res.status(400).json({
      message: 'generic-error',
      error: validation.error,
    });
  }

  const startDate = new Date(dateTimeOfReservation);
  startDate.setHours(0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  console.log('Date Boundaries', startDate, endDate);

  await WorkingDay.find({
    date: {$gte: startDate, $lt: endDate},
    pub: pubId,
  })
    .populate({
      path: 'reservations',
      populate: [
        {
          path: 'contact',
          populate: [{path: 'user', select: 'username', strictPopulate: false}],
        },
      ],
    })
    .exec()
    .then(workDay => {
      console.log(workDay);
      // If Work Day not found create new WorkDay
      if (workDay.length < 1) {
        console.log('### Create Workday');
        WorkingDay.create({
          date: dateTimeOfReservation,
          pub: pubId,
        })
          .then(newWorkDay => {
            console.log(newWorkDay);
            Pub.updateOne(
              {_id: pubId},
              {
                $push: {
                  workingdays: newWorkDay._id,
                },
              },
            )
              .then(upPub => {
                const contact = new Contact({
                  phoneNumber: contactInfo.phoneNumber,
                  phonePrefix: contactInfo.phonePrefix,
                });
                const reservation = new Reservation({
                  numberOfPeople,
                  dateTimeOfReservation,
                  pub: pubId,
                });
                // Guest Reservation
                if (!contactInfo.username) {
                  contact.isGuest = true;
                  contact
                    .save()
                    .then(newContact => {
                      reservation.contact = newContact._id;
                      reservation
                        .save()
                        .then(newReservation => {
                          newWorkDay.reservations.push(newReservation._id);
                          newWorkDay
                            .save()
                            .then(result => {
                              return res.status(200).json({
                                message: 'generic-success',
                                newReservation,
                              });
                            })
                            .catch(error => {
                              console.log(error);
                              return res.status(400).json({
                                message: 'generic-error',
                                error: error.message,
                              });
                            });
                        })
                        .catch(error => {
                          console.log(error);
                          return res.status(400).json({
                            message: 'generic-error',
                            error: error.message,
                          });
                        });
                    })
                    .catch(error =>
                      res.status(400).json({
                        message: 'generic-error',
                        error: error.message,
                      }),
                    );
                  // Non Guest Reservation
                } else {
                  User.findOne({username: contactInfo.username})
                    .then(userName => {
                      //console.log(userName);
                      //contact.user = user._id;
                      //console.log(contact);
                      //console.log(userName._id);
                      Contact.create({
                        phoneNumber: contactInfo.phoneNumber,
                        phonePrefix: contactInfo.phonePrefix,
                        user: userName._id,
                      })
                        .then(newContact => {
                          //console.log(newContact);
                          reservation.contact = newContact._id;
                          reservation
                            .save()
                            .then(newReservation => {
                              newWorkDay.reservations.push(newReservation._id);
                              newWorkDay
                                .save()
                                .then(result => {
                                  userName.contacts.push(newContact._id);
                                  userName
                                    .save()
                                    .then(success => {
                                      return res.status(200).json({
                                        message: 'generic-success',
                                        newReservation,
                                      });
                                    })
                                    .catch(error => {
                                      console.log(error);
                                      return res.status(400).json({
                                        message: 'generic-error',
                                        error: error.message,
                                      });
                                    });
                                })
                                .catch(error => {
                                  console.log(error);
                                  return res.status(400).json({
                                    message: 'generic-error',
                                    error: error.message,
                                  });
                                });
                            })
                            .catch(error =>
                              res.status(400).json({
                                message: 'generic-error',
                                error: error.message,
                              }),
                            );
                        })
                        .catch(error => {
                          console.log(error);
                          return res.status(400).json({
                            message: 'generic-error',
                            error: error.message,
                          });
                        });
                    })
                    .catch(error =>
                      res.status(400).json({
                        message: 'generic-error',
                        error: error.message,
                      }),
                    );
                }
              })
              .catch(error => {
                console.log(error);
                return res.status(400).json({
                  message: 'generic-error',
                  error: error.message,
                });
              });
          })
          .catch(error =>
            res.status(400).json({
              message: 'generic-error',
              error: error.message,
            }),
          );
        // Work Day Found validation controls
      } else {
        const todayWorkDay = workDay[0];
        console.log(todayWorkDay);
        if (todayWorkDay.stopReservations) {
          return res.status(400).json({
            message: 'generic-error',
            error: 'reservation-error-generic',
          });
        }
        const contact = new Contact({
          phoneNumber: contactInfo.phoneNumber,
          phonePrefix: contactInfo.phonePrefix,
        });
        const reservation = new Reservation({
          numberOfPeople,
          dateTimeOfReservation,
          pub: pubId,
        });
        if (contactInfo.username) {
          let reservationsToCheck = [];
          // console.log(typeof reservationsToCheck);
          if (Array.isArray(todayWorkDay.reservations)) {
            reservationsToCheck = [...todayWorkDay.reservations];
            console.log('ReservationToCheck', reservationsToCheck);
          }
          // } else if (typeof todayWorkDay.reservations === 'object') {
          //   for (let key in todayWorkDay.reservations) {
          //     console.log('reservation', todayWorkDay.reservations[key]);
          //   }
          // }
          // console.log(typeof reservationsToCheck);
          // console.log('### Checking reservations...');
          const checkObj = reservationsToCheck.filter(
            el =>
              el.contact?.user?.username === contactInfo.username &&
              el.status !== 'cancelled',
          );
          //   (accumulator, currentValue) => {
          //     if (currentValue.contact?.user?.username === contactInfo.username) {
          //       return [...accumulator, currentValue];
          //     }
          //   },
          //   [],
          // );
          console.log(checkObj);
          if (checkObj && checkObj.length > 0) {
            return res.status(400).json({
              message: 'generic-error',
              error: 'reservation-error-existing-reservation',
            });
          }
          User.findOne({username: contactInfo.username})
            .then(user => {
              contact.user = user._id;
              contact
                .save()
                .then(newContact => {
                  reservation.contact = newContact._id;
                  reservation
                    .save()
                    .then(newReservation => {
                      todayWorkDay.reservations.push(newReservation._id);
                      todayWorkDay
                        .save()
                        .then(result => {
                          user.contacts.push(newContact._id);
                          user
                            .save()
                            .then(success => {
                              return res.status(200).json({
                                message: 'generic-success',
                                newReservation,
                              });
                            })
                            .catch(error => {
                              console.log(error);
                              return res.status(400).json({
                                message: 'generic-error',
                                error: error.message,
                              });
                            });
                        })
                        .catch(error => {
                          console.log(error);
                          return res.status(400).json({
                            message: 'generic-error',
                            error: error.message,
                          });
                        });
                    })
                    .catch(error =>
                      res.status(400).json({
                        message: 'generic-error',
                        error: error.message,
                      }),
                    );
                })
                .catch(error =>
                  res.status(400).json({
                    message: 'generic-error',
                    error: error.message,
                  }),
                );
            })
            .catch(error =>
              res.status(400).json({
                message: 'generic-error',
                error: error.message,
              }),
            );
        } else {
          contact.isGuest = true;
          contact
            .save()
            .then(newContact => {
              reservation.contact = newContact._id;
              reservation
                .save()
                .then(newReservation => {
                  todayWorkDay.reservations.push(newReservation._id);
                  todayWorkDay
                    .save()
                    .then(result => {
                      return res.status(200).json({
                        message: 'generic-success',
                        newReservation,
                      });
                    })
                    .catch(error => {
                      console.log(error);
                      return res.status(400).json({
                        message: 'generic-error',
                        error: error.message,
                      });
                    });
                })
                .catch(error =>
                  res.status(400).json({
                    message: 'generic-error',
                    error: error.message,
                  }),
                );
            })
            .catch(error =>
              res.status(400).json({
                message: 'generic-error',
                error: error.message,
              }),
            );
        }
      }
    })
    .catch(error =>
      res.status(400).json({
        message: 'generic-error',
        error: error.message,
      }),
    );
};

exports.updateReservation = async (req, res, next) => {
  const {contactInfo, dateTimeOfReservation, numberOfPeople, reservationId} =
    req.body;
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
      message: 'generic-error',
      error: validation.error,
    });
  }
  await WorkingDay.find({
    reservations: {$in: reservationId},
  })
    .populate({
      path: 'reservations',
      populate: [
        {
          path: 'contact',
          populate: [{path: 'user', select: 'username', strictPopulate: false}],
        },
      ],
    })
    .exec()
    .then(workdays => {
      if (!workdays || workdays.length < 1) {
        return res.status(400).json({
          message: 'generic-error',
          error: 'reservation-error-no-reservations',
        });
      }
      const workday = workdays[0];
      if (workday.stopReservations) {
        return res.status(400).json({
          message: 'generic-error',
          error: 'reservation-error-generic',
        });
      }
      const checkObj = workday.reservations.filter(el => {
        // console.log(el.contact?.user?.username);
        // console.log(contactInfo.username);
        // console.log(el._id.toString());
        // console.log(reservationId);
        // console.log(el._id.toString() === reservationId);
        return (
          el.contact?.user?.username === contactInfo.username &&
          el._id.toString() !== reservationId &&
          el.status !== 'cancelled'
        );
      });
      console.log(checkObj);
      if (checkObj && checkObj.length > 0) {
        return res.status(400).json({
          message: 'generic-error',
          error: 'reservation-error-existing-reservation',
        });
      }
      const reservationToUpdate = workday.reservations.filter(el => {
        console.log(el._id.toString());
        console.log(reservationId);
        console.log(el._id.toString() === reservationId);
        return el._id.toString() === reservationId;
      })[0];
      // console.log(reservationToUpdate);
      // console.log(reservationToUpdate.dateTimeOfReservation);
      // console.log(dateTimeOfReservation);
      reservationToUpdate.dateTimeOfReservation = dateTimeOfReservation;
      reservationToUpdate.numberOfPeople = numberOfPeople;
      reservationToUpdate
        .save()
        .then(newReservation => {
          const contactToUpdate = reservationToUpdate.contact;
          contactToUpdate.phoneNumber = contactInfo.phoneNumber;
          contactToUpdate.phonePrefix = contactInfo.phonePrefix;
          contactToUpdate
            .save()
            .then(newContact => {
              return res.status(200).json({
                message: 'generic-success',
                newReservation,
              });
            })
            .catch(error => {
              return res.status(400).json({
                message: 'generic-error',
                error: error.message,
              });
            });
        })
        .catch(error => {
          return res.status(400).json({
            message: 'generic-error',
            error: error.message,
          });
        });
    })
    .catch(error => {
      return res.status(400).json({
        message: 'generic-error',
        error: error.message,
      });
    });
};

exports.updateReservationStatus = async (req, res, next) => {
  const {status, callback, username, reservationId} = req.body;
  await Reservation.findById(reservationId)
    .then(reservationToUpdate => {
      if (reservationToUpdate.status !== 'booked') {
        return res.status(401).json({
          message: 'generic-error',
          error: 'reservation-error-closed-reservation',
        });
      } else {
        reservationToUpdate.status = status;
        const oldCallbackStatus = reservationToUpdate.callBack;
        reservationToUpdate.callBack = callback;
        reservationToUpdate
          .save()
          .then(newReservation => {
            /* Guest Reservation */
            if (!username) {
              return res.status(200).json({
                message: 'generic-success',
                newReservation,
              });
              /* Logged Reservation */
            } else {
              User.findOne({username: username})
                .then(userToUpdate => {
                  let score =
                    status === 'shown' ? 1 : status === 'not shown' ? -2 : 0;
                  console.log('#Status Score', score);
                  console.log(oldCallbackStatus);
                  const callBackScore =
                    callback !== oldCallbackStatus && callback ? -1 : 0;
                  // console.log('#CallBack score',callBackScore);
                  score += callBackScore;
                  // console.log('#Score', score);
                  userToUpdate.score += score;
                  //console.log(userToUpdate.score);
                  userToUpdate
                    .save()
                    .then(newUser => {
                      return res.status(200).json({
                        message: 'generic-success',
                        newReservation,
                      });
                    })
                    .catch(error =>
                      res.status(400).json({
                        message: 'generic-error',
                        error: error.message,
                      }),
                    );
                })
                .catch(error =>
                  res.status(400).json({
                    message: 'generic-error',
                    error: error.message,
                  }),
                );
            }
          })
          .catch(error =>
            res.status(400).json({
              message: 'generic-error',
              error: error.message,
            }),
          );
      }
    })
    .catch(error =>
      res.status(400).json({
        message: 'generic-error',
        error: error.message,
      }),
    );
};

exports.cancelReservation = async (req, res, next) => {
  const {status, username, reservationId} = req.body;
  await Reservation.findById(reservationId)
    .then(reservationToUpdate => {
      if (reservationToUpdate.status !== 'booked') {
        return res.status(401).json({
          message: 'generic-error',
          error: 'reservation-error-closed-reservation',
        });
      } else {
        reservationToUpdate.status = status;
        reservationToUpdate
          .save()
          .then(newReservation => {
            /* Guest Reservation */
            if (!username) {
              return res.status(200).json({
                message: 'generic-success',
                newReservation,
              });
              /* Logged Reservation */
            } else {
              User.findOne({username: username})
                .then(userToUpdate => {
                  return res.status(200).json({
                    message: 'generic-success',
                    newReservation,
                  });
                  // Cancelling reservation does not update status
                  // the code is commented out rather than delete
                  // to give the possibility to future updates.
                  /*let score =
                    status === 'shown' ? 1 : status === 'not shown' ? -2 : 0;
                  console.log('#Status Score', score);
                  console.log(oldCallbackStatus);
                  const callBackScore =
                    callback !== oldCallbackStatus && callback ? -1 : 0;
                  // console.log('#CallBack score',callBackScore);
                  score += callBackScore;
                  // console.log('#Score', score);
                  userToUpdate.score += score;
                  //console.log(userToUpdate.score);
                  userToUpdate
                    .save()
                    .then(newUser => {
                      return res.status(200).json({
                        message: 'generic-success',
                        newReservation,
                      });
                    })
                    .catch(error =>
                      res.status(400).json({
                        message: 'generic-error',
                        error: error.message,
                      }),
                    );*/
                })
                .catch(error =>
                  res.status(400).json({
                    message: 'generic-error',
                    error: error.message,
                  }),
                );
            }
          })
          .catch(error =>
            res.status(400).json({
              message: 'generic-error',
              error: error.message,
            }),
          );
      }
    })
    .catch(error =>
      res.status(400).json({
        message: 'generic-error',
        error: error.message,
      }),
    );
};

exports.stopReservations = async (req, res, next) => {
  const {workdayId, stopReservations} = req.body;
  await WorkingDay.findById(workdayId)
    .populate({
      path: 'reservations',
      populate: [
        {
          path: 'contact',
          populate: [{path: 'user', select: 'username', strictPopulate: false}],
        },
      ],
    })
    .then(oldWorkDay => {
      oldWorkDay.stopReservations = stopReservations;
      oldWorkDay
        .save()
        .then(workday => {
          return res.status(200).json({message: 'generic-success', workday});
        })
        .catch(error =>
          res.status(400).json({
            message: 'generic-error',
            error: error.message,
          }),
        );
    })
    .catch(error =>
      res.status(400).json({
        message: 'generic-error',
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
  /* Guest reservation does not have username */
  // if (!username) {
  //   return {...result, error: 'Invalid username'};
  // }
  // if (!validateDate(dateStr) && !isUpdate) {
  //   return {...result, error: 'Date can not be in the past'};
  // }
  // if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
  //   return {...result, error: 'Invalid Phone Number'};
  // }
  // if (!prefix) {
  //   return {...result, error: 'Prefix must be indicated'};
  // }
  // if (!Number.isInteger(numberOfPeople) || numberOfPeople < 0) {
  //   return {...result, error: 'Invalid Number of people'};
  // }
  return result;
}
