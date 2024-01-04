import React from 'react';
import {DimensionValue, StyleSheet, Text, TouchableOpacity} from 'react-native';

type FtbUserTagProps = {
  tag: String;
  width: DimensionValue | undefined;
};

import EntypoCommentIcon from 'react-native-vector-icons/Entypo';
import UTILS from '../../../NodeApp/utilities/utils';

const FtbUserTag = (props: FtbUserTagProps) => {
  const tagWidth = StyleSheet.create({
    tagWidth: {width: props.width},
  });

  return (
    <TouchableOpacity disabled={true} style={[styles.tag, tagWidth.tagWidth]}>
      <EntypoCommentIcon
        name={UTILS.reviewManager.tagIconName}
        size={UTILS.reviewManager.tagIconSize}
        color={UTILS.reviewManager.tagIconColor}
      />
      <Text style={styles.tagTxt}>{props.tag}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tag: {
    backgroundColor: '#DCDCDC',
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 10,
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  tagTxt: {
    fontSize: 11,
  },
});

export default FtbUserTag;
