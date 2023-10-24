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
import FtbModal from './utility/components/FtbModal';
import ReviewManagerForm from './ReviewManagerForm';

type ReviewManagerDetailProp = {
  review: Object;
  isAtLeastOwner: Boolean;
  loggedUser: Object;
};

const ReviewManagerDetail = (props: ReviewManagerDetailProp) => {
  //console.log('### Props', props);

  const [detailState, setDetailState] = useState({
    comments: [],
    selectedComment: {},
    readOnlyMode: false,
    review: props.review,
    toggleModal: false,
    showConfirm: false,
    likeCounter: props.review.likes,
    dislikeCounter: props.review.dislikes,
    updatedLike: false,
    updatedDislike: false,
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

  const handleMiniBtnPress = (btnName: String) => {
    if (
      btnName === UTILS.reviewManager['mini-btn-like'] ||
      btnName === UTILS.reviewManager['mini-btn-dislike']
    ) {
      const stateBoolean =
        btnName === UTILS.reviewManager['mini-btn-like']
          ? 'updatedLike'
          : 'updatedDislike';
      const stateCounter =
        btnName === UTILS.reviewManager['mini-btn-like']
          ? 'likeCounter'
          : 'dislikeCounter';

      const addValue = detailState[stateBoolean] ? -1 : 1;

      setDetailState(prev => {
        const newState = {...prev};
        newState[stateBoolean] = !prev[stateBoolean];
        newState[stateCounter] += addValue;
        newState.showConfirm = newState.updatedLike || newState.updatedDislike;
        return newState;
      });
    }
    else if (btnName === UTILS.reviewManager['mini-btn-comments']) {
      setDetailState(prev => {
        const newState = {...prev};
        newState.selectedComment = {};
        newState.readOnlyMode = false;
        newState.toggleModal = !prev.toggleModal;
        return newState;
      })
    }
  };

  const handlePressComment = (comment: Object) => {
    console.log('inside handle press comment');
    setDetailState(prev => {
      const newState = {...prev};
      newState.selectedComment = comment;
      newState.readOnlyMode = true;
      newState.toggleModal = !prev.toggleModal;
      return newState;
    });
  };

  return (
    <View style={styles.container}>
      <ReviewTile
        review={props.review}
        likeCounter={detailState.likeCounter}
        dislikeCounter={detailState.dislikeCounter}
        tileDisabled={true}
        miniButtonDisabled={false}
        limitReviewBody={false}
        onPressMiniButton={handleMiniBtnPress}
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
                onPressComment={(tileComment: Object) =>
                  handlePressComment(tileComment)
                }
              />
            ))}
        </ScrollView>
      </View>
      <View style={styles.row}>
        {detailState.showConfirm && (
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>
              {TRANSLATIONS['review-form-btn']}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <FtbModal
        animationType="slide"
        transparent={true}
        visible={detailState.toggleModal}
        onToggleModal={() =>
          setDetailState(prev => {
            const newState = {...prev};
            newState.toggleModal = !prev.toggleModal;
            return newState;
          })
        }
        componentToShow={
          <ReviewManagerForm
            pubId={props.review?.pub}
            originalReviewId={props.review?._id}
            body={detailState.selectedComment?.reviewBody}
            readonly={detailState.readOnlyMode}
            username={props.loggedUser?.username}
            onConfirmForm={() =>
              setDetailState(prev => {
                const newState = {...prev};
                newState.toggleModal = !prev.toggleModal;
                return newState;
              })
            }
          />
        }
      />
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
