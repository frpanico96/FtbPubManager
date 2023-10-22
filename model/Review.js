/**@frpanico
 * Document to create reviews
 * Allows logged user to leave reviews to a pub
 * The pub owner can respond to the user's review
 */

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const ReviewSchema = new Mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  pub: {
    type: Schema.Types.ObjectId,
    ref: 'pub',
    required: true,
  },
  score: {
    type: Number,
  },
  createdDate: {
    type: Schema.Types.Date,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  originalReview: {
    type: Schema.Types.ObjectId,
    ref: 'review',
  },
  reviewBody: {
    type: String,
  },
});

const Review = Mongoose.model('review', ReviewSchema);
module.exports = Review;
