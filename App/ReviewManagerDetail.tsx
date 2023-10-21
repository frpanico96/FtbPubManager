import React from 'react';

import {StyleSheet, Text} from 'react-native';

import UTILS from '../utilities/utils';
import TRANSLATIONS from '../translations/tranlastions';

type ReviewManagerDetailProp = {
  review: Object;
  isAtLeastOwner: Boolean;
  loggedUser: Object;
};

const ReviewManagerDetail = (props: ReviewManagerDetailProp) => {
  console.log('### Props', props);
  return <Text>Review Manager Detail</Text>;
};

const styles = StyleSheet.create({
  container: {flex: 1},
});

export default ReviewManagerDetail;
