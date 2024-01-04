import LocalizedStrings from 'react-native-localization';
import en from './en';
import it from './it';
import { Platform } from 'react-native';

const TRANSLATIONS = new LocalizedStrings({
  'en-US': en,
  en,
  it,
});

//console.log('### Translations', Platform.OS, TRANSLATIONS.getLanguage());



export default TRANSLATIONS;
