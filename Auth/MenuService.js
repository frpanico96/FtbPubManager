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
    .then(menu => res.status(200).json({message: 'generic-success', menu}))
    .catch(error =>
      res.status(400).json({message: 'generic-error', error: error.message}),
    );
};

exports.insertMenuItem = async (req, res, next) => {
  const {
    food,
    foodCategory,
    ingredients,
    isVeganOk,
    isVegetarianOk,
    price,
    currency,
    pubId,
  } = req.body;

  if (food && foodCategory && ingredients) {
    await Menu.create({
      food,
      foodCategory,
      ingredients,
      isVeganOk,
      isVegetarianOk,
      price,
      currency,
      pub: pubId,
    })
      .then(menuItem => {
        Pub.findById(pubId)
          .then(pubToUpdate => {
            pubToUpdate.menu.push(menuItem._id);
            pubToUpdate.save().then(newPub => {
              return res
                .status(200)
                .json({message: 'generic-success', newPub, menuItem});
            });
          })
          .catch(error =>
            res.status(400).json({
              message: 'generic-error',
              error: error.message,
            }),
          );
      })
      .catch(error => {
        console.log(error);
        return res.status(400).json({
          message: 'generic-error',
          error: error.message,
        });
      });
  } else {
    return res.status(400).json({
      message: 'generic-error',
      error: 'menu-item-missing-required-fields',
    });
  }
};

exports.updateMenu = async (req, res, next) => {
  const {
    food,
    foodCategory,
    ingredients,
    isVeganOk,
    isVegetarianOk,
    price,
    currency,
    _id,
  } = req.body;

  if (_id) {
    await Menu.findById(_id)
      .then(oldMenu => {
        oldMenu.food = food ? food : oldMenu.food;
        oldMenu.foodCategory = foodCategory
          ? foodCategory
          : oldMenu.foodCategory;
        oldMenu.ingredients = ingredients ? ingredients : oldMenu.ingredients;
        oldMenu.isVeganOk =
          isVeganOk !== undefined && isVeganOk !== null
            ? isVeganOk
            : oldMenu.isVeganOk;
        oldMenu.isVegetarianOk =
          isVegetarianOk !== undefined && isVegetarianOk !== null
            ? isVegetarianOk
            : oldMenu.isVegetarianOk;
        oldMenu.price = price ? price : oldMenu.price;
        oldMenu.currency = currency ? currency : oldMenu.currency;
        oldMenu
          .save()
          .then(newMenu => {
            return res.status(200).json({message: 'generic-success', newMenu});
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
  } else {
    return res.status(400).json({
      message: 'generic-error',
      error: 'menu-item-missing-required-fields',
    });
  }
};
