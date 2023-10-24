import React, {useCallback, useState} from 'react';

import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import UTILS from '../../../utilities/utils';
import {SlideOutLeft} from 'react-native-reanimated';

type TileReviewProps = {
  review: Object;
  tileDisabled: Boolean;
  miniButtonDisabled: Boolean;
  likeCounter: Number;
  dislikeCounter: Number;
  limitReviewBody: Boolean;
  onPressMiniButton: Function;
  onPressTile: Function;
};

const ReviewTile = (props: TileReviewProps) => {
  const createdDate = new Date(props?.review?.createdDate);
  const scoreIcon =
    UTILS.reviewManager.reviewScoreOptions[props?.review?.score];
  const reviewBody =
    props?.review?.reviewBody?.length > UTILS.reviewManager.reviewMinLen && props.limitReviewBody
      ? props?.review?.reviewBody?.slice(
          0,
          UTILS.reviewManager.reviewMinLen - 1,
        ) + '...'
      : props?.review?.reviewBody;

  const tileDisabled = props.tileDisabled == null ? false : props.tileDisabled;
  const miniBtnDisabled =
    props.miniButtonDisabled == null ? true : props.miniButtonDisabled;
  const likeCounter =
    props.likeCounter == null ? props.review?.likes : props.likeCounter;
  const dislikeCounter =
    props.dislikeCounter == null
      ? props.review?.dislikes
      : props.dislikeCounter;
  const handleTilePress = () => {
    props.onPressTile(props.review);
  };
  const handleMiniButtonPress = (btnName: String) => {
    props.onPressMiniButton(btnName);
  };

  return (
    <TouchableOpacity
      style={styles.reviewTile}
      disabled={tileDisabled}
      onPress={handleTilePress}>
      <View style={styles.tileReviewInfoContainer}>
        <View style={styles.container}>
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
        {UTILS.reviewManager.miniButtons.map(miniBtn => {
          const propToShow =
            miniBtn.name === UTILS.reviewManager['mini-btn-like']
              ? likeCounter
              : miniBtn.name === UTILS.reviewManager['mini-btn-dislike']
              ? dislikeCounter
              : null;

          return (
            <TouchableOpacity
              key={miniBtn.name}
              style={styles.tileReviewFooterBtn}
              disabled={miniBtnDisabled}
              onPress={() => handleMiniButtonPress(miniBtn.name)}>
              <View style={styles.tileReviewFooterIcon}>
                {Platform.OS === 'ios' && (
                  <Icon
                    name={miniBtn.iconName}
                    size={miniBtn.size}
                    color={miniBtn.color}
                  />
                )}
              </View>
              <View style={styles.tileReviewFooterTxt}>
                <Text>{propToShow}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
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
  tileReviewDescription: {width: '100%', fontWeight: '400', fontSize: 18},
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
});

export default ReviewTile;
