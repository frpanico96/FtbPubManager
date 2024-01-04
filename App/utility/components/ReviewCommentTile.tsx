import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import UTILS from '../../../NodeApp/utilities/utils';
import FtbUserTag from './FtbUserTag';

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
      <Text style={styles.cardUsername}>
        {props.comment.user?.username?.toUpperCase()}
      </Text>
      {props?.comment?.postedByRole &&
        props?.comment?.postedByRole !== 'Customer' && (
          <FtbUserTag
            tag={props?.comment?.postedByRole}
            width={UTILS.reviewManager.tagSizeComment}
          />
        )}
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
  tag: {
    backgroundColor: '#DCDCDC',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    width: '18%',
    borderRadius: 10,
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  tagTxt: {
    fontSize: 11,
  },
});

export default ReviewCommentTile;
