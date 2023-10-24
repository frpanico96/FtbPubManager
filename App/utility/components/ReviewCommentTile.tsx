import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import UTILS from '../../../utilities/utils';

type ReviewCommentTileProps = {
  comment: Object;
  onPressComment: Function;
};

const ReviewCommentTile = (props: ReviewCommentTileProps) => {
  const reviewBody =
    props?.comment?.reviewBody?.length > UTILS.reviewManager.reviewMinLen
      ? props?.comment?.reviewBody?.slice(
          0,
          UTILS.reviewManager.reviewMinLen - 1,
        ) + '...'
      : props?.comment?.reviewBody;

  const handlePressComment = () => {
    props.onPressComment(props.comment);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePressComment}>
      <Text style={styles.cardUsername}>{props.comment.user?.username}</Text>
      <Text style={styles.cardCommentBody}>{reviewBody}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 5,
    borderWidth: 1,
  },
  cardUsername: {fontSize: 16, fontWeight: '600'},
  cardCommentBody: {fontSize: 12, fontWeight: '400'},
});

export default ReviewCommentTile;
