const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const MenuSchema = Mongoose.Schema({
  food: {
    type: String,
    unique: false,
    required: true,
  },
  foodCategory: {
    type: String,
    unique: false,
    required: true,
    enum: [
      'appetizers',
      'first course',
      'second course',
      'dessert',
      'drinks',
      'others',
    ],
  },
  ingredients: {
    type: String,
    unique: false,
    required: true,
  },
  isVeganOk: {
    type: Boolean,
    required: false,
    default: false,
  },
  isVegetarianOk: {
    type: Boolean,
    required: false,
    default: false,
  },
  pub: {
    type: Schema.Types.ObjectId,
    ref: 'pub',
  },
});

const Menu = Mongoose.model('menu', MenuSchema);
module.exports = Menu;
