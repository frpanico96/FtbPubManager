import React, {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {type ReviewFormBody} from './utility/types/types';
import {ReviewAction} from './utility/types/types';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import UTILS from '../utilities/utils';
import TRANSLATIONS from '../translations/tranlastions';

type ReviewManagerFormProps = {
  pubId: String;
  username: String;
  originalReviewId: String;
  onConfirmForm: Function;
};

const ReviewManagerForm = (props: ReviewManagerFormProps) => {
  //console.log('### Props', props);

  const scoreOptions = UTILS.reviewManager.reviewScoreOptions;
  let itemsWiIcons: Array<Object> = [];
  for (let key in scoreOptions) {
    const singlItem = {
      label: scoreOptions[key]?.label,
      value: key,
      icon: () => {
        if (Platform.OS === 'ios') {
          return (
            <Icon
              name={scoreOptions[key]?.iconName}
              size={scoreOptions[key]?.dropdownSize}
              color={scoreOptions[key]?.color}
            />
          );
        }
      },
    };
    itemsWiIcons = [...itemsWiIcons, singlItem];
  }
  //console.log(itemsWiIcons);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [items, setItems] = useState(itemsWiIcons);
  const [reviewBody, setReviewBody] = useState('');

  const handleConfirm = () => {
    const action: ReviewAction = props.originalReviewId
      ? ReviewAction.COMMENT
      : ReviewAction.REVIEW;
    const body = {
      score: value,
      pubId: props.pubId,
      username: props.username,
      reviewBody,
    };
    const form: ReviewFormBody = {
      action,
      body: JSON.stringify(body),
    };

    props.onConfirmForm(form);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropDownContainer}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder={TRANSLATIONS['review-score-placeholder']}
        />
      </View>
      <TextInput
        style={styles.textArea}
        value={reviewBody}
        multiline={true}
        onChangeText={setReviewBody}
        placeholder={TRANSLATIONS['review-body-placeholder']}
      />
      <View>
        <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
          <Text style={styles.btnText}>{TRANSLATIONS['review-form-btn']}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  dropDownContainer: {
    width: '100%',
    zIndex: 2000,
    padding: 10,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 6,
    maxHeight: 300,
    paddingHorizontal: 5,
    paddingVertical: 100,
  },
  btn: {
    backgroundColor: 'pink',
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 10,
  },
  btnText: {fontSize: 18, textAlign: 'center'},
});

export default ReviewManagerForm;
