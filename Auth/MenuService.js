/**@frpanico
 * Menu Web Service
 * It allows to create new food categories
 * and new foods
 */

//const Food = require('../model/Food');
//const FoodCategory = require('../model/FoodCategory');
const Menu = require('../model/Menu');
const Pub = require('../model/Pub');

exports.getMenu = async (req, res, next) => {
  const {pubId} = req.body;
  await Menu.find({pub: pubId})
    .then(menu => res.status(200).json({message: 'Success', menu}))
    .catch(error =>
      res.status(400).json({message: 'Error', error: error.message}),
    );
};

exports.insertMenuItem = async (req, res, next) => {
  const {food, foodCategory, ingredients, isVeganOk, isVegetarianOk, pub} =
    req.body;
  if (food && foodCategory && ingredients) {
    await Menu.create({
      food,
      foodCategory,
      ingredients,
      isVeganOk,
      isVegetarianOk,
      pub,
    })
      .then(menuItem => {
        Pub.findById(pub)
          .then(pubToUpdate => {
            pubToUpdate.menu.push(menuItem._id);
            pubToUpdate.save().then(newPub => {
              return res
                .status(200)
                .json({message: 'Success', newPub, menuItem});
            });
          })
          .catch(error =>
            res.status(400).json({
              message: 'Error!',
              error: error.message,
            }),
          );
      })
      .catch(error =>
        res.status(400).json({
          message: 'Error!',
          error: error.message,
        }),
      );
  } else {
    return res.status(400).json({
      message: 'Error!',
      error: 'Missing Required Fields!',
    });
  }
};

/*
exports.insertFoodCategory = async (req, res, next) => {
  const {name} = req.body;
  if (name) {
    console.log(name);
    await FoodCategory.create({
      name,
    })
      .then(foodCategory => {
        console.log(foodCategory);
        return res.status(200).json({message: 'Success', foodCategory});
      })
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

exports.insertFood = async (req, res, next) => {
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
*/
