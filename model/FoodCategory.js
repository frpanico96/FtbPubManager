/**@frpanico
 * FoodCategory schema file
 * Menu is composed of different food categories (e.g. Appetizers, drinks, main)
 * It is currentyly defined by three fields
 * -- Name
 * -- foods (child food)
 * -- Logo
 */

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const FoodCategorySchema = new Mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  foods: [
    {
      type: Schema.Types.ObjectId,
      ref: 'food',
    },
  ],
  logo: {
    type: String,
    default: 'pub-default-btn',
  },
});

const FoodCategory = Mongoose.model('foodcategory', FoodCategorySchema);
module.exports = FoodCategory;
