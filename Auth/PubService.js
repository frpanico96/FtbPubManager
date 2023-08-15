const User = require('../model/User');
const Pub = require('../model/Pub');

exports.insertPub = async (req, res, next) => {
  const {name, owner} = req.body;

  if (name && owner) {
    await Pub.create({
      name,
      owner,
    }).then(pub => {
      User.findById(owner).then(user => {
        user.pubs.push(pub._id);
        user.save().then(user => {
          return res.status(201).json({message: 'Pub successfully created', pub, user});
        })
        .catch(error => res.status(401).json({message: 'Error', error: error.message}))
      })
      .catch(error => res.status(401).json({message: 'Error', error: error.message}))
    })
    .catch(error => res.status(401).json({message: 'Error', error: error.message}));
  } else {
    return res
      .status(401)
      .json({message: 'Error', error: 'Name or Owner not provided'});
  }
};

exports.getAllPubs = async (req, res, next) => {
  await Pub.find()
    .populate('owner', 'username')
    .exec()
    .then(pubs => {
      return res.status(201).json({message: 'Pub successfully fetched', pubs});
    })
    .catch(error => res.status(401).json({message: 'Error', error: error.message}))
};

exports.updatePub = async (req, res, next) => {
  const {id, name, owner} = req.body;
  if(id){
    if(name || owner)
    {
      await Pub.findById(id).then(pub => {
        pub.name = name ? name : pub.name;
        pub.owner = owner ? owner : pub.owner;
        pub.save()
        .then(newPub => res.status(201).json({message: 'Pub succesfully updated', newPub}));
      })
      .catch(error => res.status(401).json({message: 'Error', error: error.message}))
    }
    else{
      return res.status(401).json({message: 'Error', error: 'At least a name or an owner must be provided'});
    }
  }else{
    return res.status(401).json({message: 'Error', error: 'An Id must be provided'});
  }
};

exports.deletePub = async (req, res, next) => {
  const {id} = req.body;
  if (id){
    await Pub.findById(id).then(pub => {
      pub.deleteOne().then(oldPub => res.status(201).json({message: 'Pub successfully deleted', oldPub}));
    })
    .catch(error => res.status(401).json({message: 'Error', error: error.message}))
  }
  else {
    return res.status(401).json({message: 'Error', error: 'An id must be provided'});
  }
}
