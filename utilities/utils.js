/**@frpanico
 * Utils file to store all static strings
 * In order to not hardCode them in the component files
 */
const UTILS = {
  pubMain: [
    {name: 'pub-main-menu', label: 'Menu'},
    {name: 'pub-main-resevation', label: 'Reserve a Table'},
    {name: 'pub-main-contact-us', label: 'Contact Us'},
    {name: 'pub-main-manage-reservation', label: 'Manage Reservation'},
    {name: 'pub-main-close-pub', label: 'Close Pub'},
  ],
  menuManager: {
    'mm-new-menu': 'New Menu Item',
    'menu-action-name': 'new-menu-item',
    'menu-food-categories': [
      {label: 'Appetizers', value: 'appetizers'},
      {label: 'First Course', value: 'first course'},
      {label: 'Second Course', value: 'second course'},
      {label: 'Desserts', value: 'dessert'},
      {label: 'Drinks', value: 'drinks'},
      {label: 'Others', value: 'others'},
    ],
    'menu-item-currency': [
      {label: 'EUR', value: 'EUR'},
      {label: 'USD', value: 'USD'},
    ],
  },
  goBack: 'Go Back',
  save: 'Save',
  serverBasePath: 'http://localhost:5001/api/auth',
};

export default UTILS;
