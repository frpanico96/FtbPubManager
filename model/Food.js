/**@frpanico
 * Food schema file
 * Menu is composed of different food
 * It is currentyly defined by three fields
 * -- Name
 * -- Number
 * -- FoodCategory
 * -- Ingredients
 */

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const FoodSchema = new Mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  number: {
    type: Number,
    unique: true,
    required: false,
  },
  foodCategory: {
    type: Schema.Types.ObjectId,
    ref: 'foodcategory',
  },
  ingredients: {
    type: String,
    unique: false,
    required: true,
  },
});

const Food = Mongoose.model('food', FoodSchema);
module.exports = Food;
