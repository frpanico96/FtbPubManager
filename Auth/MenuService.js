/**@frpanico
 * Menu Web Service
 * It allows to create new food categories
 * and new foods
 */

const Food = require('../model/Food');
const FoodCategory = require('../model/FoodCategory');

exports.getMenu = async ({req, res, next}) => {
  await FoodCategory.find()
    .then(menu => res.status(200).json({message: 'Success', menu}))
    .catch(error =>
      res.status(400).json({message: 'Error', error: error.message}),
    );
};

exports.insertFoodCategory = async ({req, res, next}) => {
  const {name, logo} = req.body;

  if (name) {
    await FoodCategory.create({
      name,
      logo,
    })
      .then(foodCategory =>
        res.status(200).json({message: 'Success', foodCategory}),
      )
      .catch(error =>
        res.status(400).json({message: 'Error', error: error.message}),
      );
  } else {
    return res.status(401).json({
      message: 'Error',
      error: 'A name must be required',
    });
  }
};

exports.insertFood = async ({req, res, next}) => {
  const {name, foodCategory, number, ingredients} = req.body;
  if (name && foodCategory && ingredients) {
    Food.create({
      name,
      foodCategory,
      ingredients,
      number,
    })
      .then(food => {
        FoodCategory.findById(foodCategory)
          .then(foodCategoryToUpdate => {
            foodCategoryToUpdate.foods.push(food._id);
            foodCategoryToUpdate
              .save()
              .then(newFoodCategory => 
                res.status(200).json({
                  message: 'Success',
                  food,
                  newFoodCategory,
                }),
              )
              .catch(error =>
                res.status(400).json({message: 'Error', error: error.message}),
              );
          })
          .catch(error =>
            res.status(400).json({message: 'Error', error: error.message}),
          );
      })
      .catch(error =>
        res.status(400).json({message: 'Error', error: error.message}),
      );
  } else {
    return res.status(401).json({
      message: 'Error',
      error: 'Missing required info: name, foodCategory, ingredients',
    });
  }
};
