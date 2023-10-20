import React, { useCallback, useState } from 'react';

import UTILS from '../utilities/utils';
import TRANSLATIONS from '../translations/tranlastions';
import {StyleSheet, Text, ScrollView, View} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

type ReviewManagerProps = {
  pub: Object;
};

const ReviewManager = (props: ReviewManagerProps) => {

  const [reviews, setReviews] = useState([]);


  const fetchPubReviews = (pubId: String) => {
    fetch(UTILS.serverBasePath + '/getPubReviews', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({pubId}),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log('@@@ Fetched Reviews', jsonRes.reviews);
        setReviews(jsonRes.reviews);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchPubReviews(props.pub._id);
    }, [props.pub]),
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
    </ScrollView>
  );

};

const styles = StyleSheet.create({
  scrollView: {flexGrow: 1, justifyContent: 'space-evenly'},
  reviewTileContainer: {flex: 1},
  reviewTile: {backgroundColor: '#FFF', flex: 1},
})

export default ReviewManager;
