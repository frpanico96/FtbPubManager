/**@frpanico
 * Document to create a junction object between user and log
 * allows the user to not like/dislike a review multiple times
 */

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const FeedbackUserLogSchema = new Mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  feedbackType: {
    type: String,
    enum: ['positive', 'negative'],
    required: true,
  },
  review: {
    type: Schema.Types.ObjectId,
    ref: 'review',
    required: true,
  },
});

const Review = Mongoose.model('feedbackuserlog', FeedbackUserLogSchema);
module.exports = Review;
