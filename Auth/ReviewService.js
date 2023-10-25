/**@frpanico
 * Review Service
 */

const User = require('../model/User');
const Review = require('../model/Review');

exports.getReviewsByPub = async (req, res, next) => {
  const {pubId} = req.body;
  await Review.find({pub: pubId, originalReview: null})
    .populate({
      path: 'user',
      select: 'username',
    })
    .then(reviews => {
      return res.status(200).json({
        message: 'generic-success',
        reviews,
      });
    })
    .catch(error => {
      return res.status(400).json({
        message: 'generic-error',
        error: error.message,
      });
    });
};

exports.getReviewComments = async (req, res, next) => {
  const {reviewId} = req.body;
  await Review.find({originalReview: reviewId})
    .populate({
      path: 'user',
      select: 'username',
    })
    .then(reviews => {
      return res.status(200).json({
        message: 'generic-success',
        reviews,
      });
    })
    .catch(error => {
      return res.status(400).json({
        message: 'generic-error',
        error: error.message,
      });
    });
};

exports.insertReview = async (req, res, next) => {
  const {username, pubId, reviewBody, score} = req.body;
  await User.findOne({username})
    .then(user => {
      const review = new Review({
        user: user._id,
        pub: pubId,
        reviewBody: reviewBody,
        createdDate: new Date(),
        score: score,
      });
      review
        .save()
        .then(newReview => {
          return res.status(200).json({
            message: 'generic-success',
            newReview,
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

exports.commentReview = async (req, res, next) => {
  const {username, pubId, reviewId, reviewBody} = req.body;
  console.log('Inside Comments');
  await User.findOne({username})
    .then(user => {
      const review = new Review({
        user: user._id,
        pub: pubId,
        reviewBody: reviewBody,
        createdDate: new Date(),
        originalReview: reviewId,
      });
      review
        .save()
        .then(newReview => {
          return res.status(200).json({
            message: 'generic-success',
            newReview,
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
};

exports.reviewFeedback = async (req, res, next) => {
  const {like, dislike, reviewId} = req.body;
  await Review.findById(reviewId)
    .then(reviewToUpdate => {
      if (like && like > reviewToUpdate?.likes) {
        reviewToUpdate.likes = like;
      }
      if (dislike && dislike > reviewToUpdate?.dislikes) {
        reviewToUpdate.dislikes = dislike;
      }
      reviewToUpdate
        .save()
        .then(newReview => {
          return res.status(200).json({
            message: 'generic-success',
            newReview,
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
