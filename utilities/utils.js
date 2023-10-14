/**@frpanico
 * Utils file to store all static strings
 * In order to not hardCode them in the component files
 */
import TRANSLATIONS from '../translations/tranlastions';

const UTILS = {
  pubMain: [
    {name: 'pub-main-menu', label: 'Menu'},
    {name: 'pub-main-resevation', label: 'Reserve a Table'},
    {name: 'pub-main-contact-us', label: 'Contact Us'},
    {name: 'pub-main-manage-reservation', label: 'Manage Reservation'},
    {name: 'pub-main-close-pub', label: 'Close Pub'},
  ],
  menuAction: 'pub-main-menu',
  reservationAction: 'pub-main-resevation',
  reservationManagerAction: 'pub-main-manage-reservation',
  contactUsAction: 'pub-main-contact-us',
  menuManager: {
    'mm-new-menu': 'New Menu Item',
    'menu-action-name': 'new-menu-item',
    'menu-food-categories': [
      {label: TRANSLATIONS.appetizers, value: 'appetizers'},
      {label: TRANSLATIONS['first course'], value: 'first course'},
      {label: TRANSLATIONS['second course'], value: 'second course'},
      {label: TRANSLATIONS.dessert, value: 'dessert'},
      {label: TRANSLATIONS.drinks, value: 'drinks'},
      {label: TRANSLATIONS.others, value: 'others'},
    ],
    'menu-food-categories-order': {
      appetizers: 10,
      'first course': 20,
      'second course': 30,
      dessert: 40,
      drinks: 50,
      others: 60,
    },
    'menu-item-currency': [
      {label: 'EUR', value: 'EUR'},
      {label: 'USD', value: 'USD'},
    ],
  },
  reservation: {
    'prefix-options': [
      {label: '+39', value: '+39'},
      {label: '+01', value: '+01'},
    ],
  },
  reservationManager: {
    'status-options': [
      {label: TRANSLATIONS.booked, value: 'booked'},
      {label: TRANSLATIONS.shown, value: 'shown'},
      {label: TRANSLATIONS['not shown'], value: 'not shown'},
    ],
    'action-type-edit': 'edit',
    'action-type-cancel': 'cancel',
    'action-type-status': 'status',
    'action-name-user-reservation': 'user-reservation',
  },
  contactUsManager: {
    infos: [
      {label: 'Address', field: 'address'},
      {label: 'Phone', field: 'phone'},
      {label: 'Email', field: 'email'},
      {label: 'Opens at', field: 'openTime'},
      {label: 'Closes at', field: 'closeTime'},
      {label: 'Closing Days', field: 'daysClosed'},
      {label: 'Vacation Start', field: 'vacationStart'},
      {label: 'Vacation End', field: 'vacationEnd'},
      {label: 'Vacation Reason', field: 'vactionReason'},
    ],
    'contact-us-action': 'contact-us-detail',
    actions: [
      {label: 'Contact Data', name: 'contact-data'},
      {label: 'Address', name: 'address'},
      {label: 'Opening/Closing Time', name: 'opening-closing'},
      {label: 'Vacation', name: 'vacation'},
      {label: 'Reservation Info', name: 'reservation-info'},
    ],
    'contact-data-name': 'contact-data',
    'address-name': 'address',
    'opening-closing-name': 'opening-closing',
    'vacation-name': 'vacation',
    'reservation-info-name': 'reservation-info',
  },
  goBack: 'Go Back',
  save: 'Save',
  serverBasePath: 'http://localhost:5001/api/auth',
  dayOfWeek: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  dayOfWeekOptions: [
    {label: 'Sunday', value: 0},
    {label: 'Monday', value: 1},
    {label: 'Tuesday', value: 2},
    {label: 'Wednesday', value: 3},
    {label: 'Thursday', value: 4},
    {label: 'Friday', value: 5},
    {label: 'Saturday', value: 6},
  ],
};

export default UTILS;
