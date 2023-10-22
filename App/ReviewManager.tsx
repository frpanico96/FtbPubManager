import React, {useCallback, useState} from 'react';

import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {ReviewAction, ReviewFormBody} from './utility/types/types';

import UTILS from '../utilities/utils';
import TRANSLATIONS from '../translations/tranlastions';
import FtbModal from './utility/components/FtbModal';
import ReviewManagerForm from './ReviewManagerForm';
import Toast from 'react-native-toast-message';

type ReviewManagerProps = {
  pub: Object;
  isLoggedUser: Boolean;
  isAtLeastOwner: Boolean;
  username: String;
  onNavigateToDetail: Function;
};

type TileReviewProps = {
  review: Object;
  onPressTile: Function;
};

const ReviewManager = (props: ReviewManagerProps) => {
  console.log('### Is Logged', props.isLoggedUser);
  console.log('### Is at least Owner', props.isAtLeastOwner);

  const [reviews, setReviews] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);

  const fetchPubReviews = (pubId: String, refresher: Boolean) => {
    if (toggleModal) {
      return;
    }
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
      fetchPubReviews(props.pub._id, toggleModal);
    }, [props.pub, toggleModal]),
  );

  const handleTilePress = review => {
    props.onNavigateToDetail(review);
  };

  const handleConfirmModal = (form: ReviewFormBody) => {
    const apiToCall =
      form.action === ReviewAction.REVIEW ? '/addReview' : 'addReviewComment';
    const successMessage =
      form.action === ReviewAction.REVIEW
        ? TRANSLATIONS['review-success']
        : TRANSLATIONS['review-comment-success'];
    fetch(UTILS.serverBasePath + apiToCall, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: form.body,
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
        if (jsonRes.error) {
          Toast.show({
            type: 'error',
            text1: TRANSLATIONS['generic-error'],
            text2: TRANSLATIONS[jsonRes.error]
              ? TRANSLATIONS[jsonRes.error]
              : jsonRes.error,
            position: 'bottom',
          });
          return;
        }
        Toast.show({
          type: 'success',
          text1: TRANSLATIONS['generic-success'],
          text2: successMessage,
          position: 'bottom',
        });
        setTimeout(() => {
          setToggleModal(!toggleModal);
        }, UTILS.reviewManager.timeoutModal);
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: TRANSLATIONS['generic-error'],
          text2: TRANSLATIONS[error] ? TRANSLATIONS[error] : error,
          position: 'bottom',
        });
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {reviews &&
          reviews.length > 0 &&
          reviews.map(review => (
            <TileReview
              key={review._id}
              review={review}
              onPressTile={handleTilePress}
            />
          ))}
      </ScrollView>
      <View style={styles.btnContainer}>
        {props.isLoggedUser && (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setToggleModal(!toggleModal)}>
            <Text style={styles.btnText}>{TRANSLATIONS['review-btn']}</Text>
          </TouchableOpacity>
        )}
      </View>
      <FtbModal
        animationType="slide"
        transparent={true}
        visible={toggleModal}
        onToggleModal={() => setToggleModal(!toggleModal)}
        componentToShow={
          <ReviewManagerForm
            pubId={props.pub._id}
            originalReviewId={undefined}
            username={props.username}
            onConfirmForm={handleConfirmModal}
          />
        }
      />
    </View>
  );
};

const TileReview = (props: TileReviewProps) => {
  const createdDate = new Date(props?.review?.createdDate);
  const scoreIcon =
    UTILS.reviewManager.reviewScoreOptions[props?.review?.score];
  const reviewBody =
    props?.review?.reviewBody?.length > UTILS.reviewManager.reviewMinLen
      ? props?.review?.reviewBody?.slice(
          0,
          UTILS.reviewManager.reviewMinLen - 1,
        ) + '...'
      : props?.review?.reviewBody;

  const handleTilePress = () => {
    props.onPressTile(props.review);
  };

  return (
    <TouchableOpacity style={styles.reviewTile} onPress={handleTilePress}>
      <View style={styles.tileReviewInfoContainer}>
        <View style={{flex: 1}}>
          <Text style={styles.tileUserTxt}>
            {props.review?.user?.username?.toUpperCase()}
          </Text>
        </View>
        <View style={styles.tileReviewScore}>
          <Text style={styles.tileUserDateTxt}>
            {createdDate?.toLocaleString()}
          </Text>
          {Platform.OS === 'ios' && (
            <Icon
              name={scoreIcon?.iconName}
              size={scoreIcon?.reviewSize}
              color={scoreIcon?.color}
            />
          )}
        </View>
      </View>
      <View style={styles.tileReviewDescriptionContainer}>
        <Text style={styles.tileReviewDescription}>{reviewBody}</Text>
      </View>
      <View style={styles.tileReviewFooter}>
        <TouchableOpacity style={styles.tileReviewFooterBtn} disabled={true}>
          <View style={styles.tileReviewFooterIcon}>
            {Platform.OS === 'ios' && (
              <Icon
                name={UTILS.reviewManager.reviewThumbsUp.iconName}
                size={UTILS.reviewManager.reviewThumbsUp.size}
                color={UTILS.reviewManager.reviewThumbsUp.color}
              />
            )}
          </View>
          <View style={styles.tileReviewFooterTxt}>
            <Text>{props.review?.likes}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tileReviewFooterBtn} disabled={true}>
          <View style={styles.tileReviewFooterIcon}>
            {Platform.OS === 'ios' && (
              <Icon
                name={UTILS.reviewManager.reviewThumbsDown.iconName}
                size={UTILS.reviewManager.reviewThumbsDown.size}
                color={UTILS.reviewManager.reviewThumbsDown.color}
              />
            )}
          </View>
          <View style={styles.tileReviewFooterTxt}>
            <Text>{props.review?.dislikes}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tileReviewFooterBtn} disabled={true}>
          <View style={styles.tileReviewFooterIcon}>
            {Platform.OS === 'ios' && (
              <Icon
                name={UTILS.reviewManager.reviewComments.iconName}
                size={UTILS.reviewManager.reviewComments.size}
                color={UTILS.reviewManager.reviewComments.color}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, width: '100%'},
  scrollView: {flexGrow: 1, justifyContent: 'space-evenly', width: '100%'},
  reviewTileContainer: {flex: 1, width: '100%'},
  reviewTile: {backgroundColor: '#FFF', borderWidth: 1, borderRadius: 10},
  tileReviewInfoContainer: {
    width: '100%',
    alignItems: 'flex-start',
    flexDirection: 'row',
    padding: 10,
  },
  tileUserTxt: {fontWeight: '700', fontSize: 27},
  tileUserDateTxt: {fontWeight: '500', fontSize: 16},
  tileReviewScore: {flex: 1, alignItems: 'flex-end'},
  tileReviewDescriptionContainer: {padding: 10},
  tileReviewDescription: {width: '100%', fontWeight: '400', fontSize: 20},
  tileReviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 6,
  },
  tileReviewFooterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  tileReviewFooterIcon: {},
  tileReviewFooterTxt: {marginLeft: 5, fontSize: 15, fontWeight: '600'},
  btnContainer: {
    alignItems: 'center',
  },
  btn: {
    backgroundColor: 'pink',
    width: '60%',
    padding: 3,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 10,
  },
  btnText: {fontSize: 18, textAlign: 'center', padding: 6},
});

export default ReviewManager;
