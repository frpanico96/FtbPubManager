import React, {useCallback, useState} from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import UTILS from '../utilities/utils';
import TRANSLATIONS from '../translations/tranlastions';
import {useFocusEffect} from '@react-navigation/native';
import ReviewTile from './utility/components/ReviewTile';
import ReviewCommentTile from './utility/components/ReviewCommentTile';

type ReviewManagerDetailProp = {
  review: Object;
  isAtLeastOwner: Boolean;
  loggedUser: Object;
};

const ReviewManagerDetail = (props: ReviewManagerDetailProp) => {
  console.log('### Props', props);

  const [detailState, setDetailState] = useState({
    comments: [],
    toggleModal: false,
  });

  const fetchComments = (reviewId: String, refresher: Boolean) => {
    if (refresher) {
      return;
    }
    fetch(UTILS.serverBasePath + '/getReviewComments', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({reviewId}),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log('@@@ Fetched Comments', jsonRes.reviews);
        setDetailState(prev => {
          const newState = {...prev};
          newState.comments = jsonRes.reviews;
          return newState;
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchComments(props.review._id, detailState.toggleModal);
    }, [props.review._id, detailState.toggleModal]),
  );

  return (
    <View style={styles.container}>
      <ReviewTile
        review={props.review}
        onPressTile={() => console.log('###')}
      />
      <View style={[styles.row, styles.commentsContainer]}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {detailState.comments &&
            detailState.comments.length > 0 &&
            detailState.comments.map(comment => (
              <ReviewCommentTile
                key={comment._id}
                comment={comment}
                onPressComment={() => console.log('###')}
              />
            ))}
        </ScrollView>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>{TRANSLATIONS['review-form-btn']}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, width: '100%', padding: 10, marginTop: 10},
  row: {flex: 1},
  commentsContainer: {
    flex: 3,
    backgroundColor: 'gray',
    borderRadius: 6,
    padding: 5,
    marginTop: 3,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  btn: {
    backgroundColor: 'pink',
    width: '60%',
    padding: 3,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 10,
    alignSelf: 'center',
  },
  btnText: {fontSize: 18, textAlign: 'center', padding: 6},
});

export default ReviewManagerDetail;
