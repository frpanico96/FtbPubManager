/**@frpanico
 * Server Side file for PUBS
 * It handles:
 * -- Insert
 * -- Get all pubs
 * -- Update pubs
 * -- Delete pubs
 */
const User = require('../model/User');
const Pub = require('../model/Pub');

exports.insertPub = async (req, res, next) => {
  const {
    name,
    owner,
    showOwner,
    openTime,
    closeTime,
    daysClosed,
    vacationStart,
    vacationEnd,
    vactionReason,
    address,
    phonePrefix,
    phone,
    email,
    reservationDelay,
  } = req.body;
  const validation = pubValidations(
    openTime,
    closeTime,
    vacationStart,
    vacationEnd,
    phone,
    email,
  );
  if (!validation) {
    if (name && owner) {
      await Pub.create({
        name,
        owner,
        showOwner,
        openTime,
        closeTime,
        daysClosed,
        vacationStart: new Date(vacationStart),
        vacationEnd: new Date(vacationEnd),
        vactionReason,
        address,
        phonePrefix,
        phone,
        email: email.toLowerCase(),
        reservationDelay,
      })
        .then(pub => {
          User.findById(owner)
            .then(user => {
              user.pubs.push(pub._id);
              user
                .save()
                .then(newUser => {
                  return res.status(201).json({
                    message: 'Pub successfully created',
                    pub,
                    owner: newUser.username,
                  });
                })
                .catch(error =>
                  res.status(401).json({
                    message: 'Error',
                    error: error.message,
                  }),
                );
            })
            .catch(error =>
              res.status(401).json({message: 'Error', error: error.message}),
            );
        })
        .catch(error =>
          res.status(401).json({message: 'Error', error: error.message}),
        );
    } else {
      return res
        .status(401)
        .json({message: 'Error', error: 'Name or Owner not provided'});
    }
  } else {
    return res.status(401).json({message: 'Error', error: validation});
  }
};

exports.getPubById = async (req, res, next) => {
  const {pubId} = req.body;
  await Pub.findById(pubId)
    .populate('owner', 'username')
    .exec()
    .then(pub => {
      return res.status(201).json({
        message: 'pub-service-fetch-successful',
        pub,
      });
    })
    .catch(error =>
      res.status(401).json({message: 'generic-error', error: error.message}),
    );
};

exports.getAllPubs = async (req, res, next) => {
  await Pub.find()
    .populate('owner', 'username')
    .exec()
    .then(pubs => {
      return res.status(201).json({
        message: 'pub-service-fetch-successful',
        pubs,
      });
    })
    .catch(error =>
      res.status(401).json({message: 'generic-error', error: error.message}),
    );
};

exports.updatePub = async (req, res, next) => {
  const {id, name, owner} = req.body;
  if (id) {
    if (name || owner) {
      await Pub.findById(id)
        .then(pub => {
          pub.name = name ? name : pub.name;
          pub.owner = owner ? owner : pub.owner;
          pub
            .save()
            .then(newPub =>
              res
                .status(201)
                .json({message: 'Pub succesfully updated', newPub}),
            );
        })
        .catch(error =>
          res.status(401).json({message: 'Error', error: error.message}),
        );
    } else {
      return res.status(401).json({
        message: 'Error',
        error: 'At least a name or an owner must be provided',
      });
    }
  } else {
    return res
      .status(401)
      .json({message: 'Error', error: 'An Id must be provided'});
  }
};

exports.deletePub = async (req, res, next) => {
  const {id} = req.body;
  if (id) {
    await Pub.findById(id)
      .then(pub => {
        pub
          .deleteOne()
          .then(oldPub =>
            res.status(201).json({message: 'Pub successfully deleted', oldPub}),
          );
      })
      .catch(error =>
        res.status(401).json({message: 'Error', error: error.message}),
      );
  } else {
    return res
      .status(401)
      .json({message: 'Error', error: 'An id must be provided'});
  }
};

function pubValidations(
  openTime,
  closeTime,
  vacationStart,
  vacationEnd,
  phone,
  email,
) {
  const regexPhone = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  const regexEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // if (openTime >= closeTime) {
  //   return 'Open Time must be minor than close time';
  // }
  if (vacationStart > vacationEnd) {
    return 'pub-service-vacation-error';
  }
  if (!regexPhone.test(phone)) {
    return 'invalid-phone-number';
  }
  if (!regexEmail.test(email.toLowerCase())) {
    return 'invalid-email';
  }
  return '';
}
