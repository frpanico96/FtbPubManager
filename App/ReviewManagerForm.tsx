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

import UTILS from '../NodeApp/utilities/utils';
import TRANSLATIONS from '../NodeApp/translations/tranlastions';
import Review from '../NodeApp/model/Review';
import Toast from 'react-native-toast-message';

type ReviewManagerFormProps = {
  pubId: String;
  loggedUser: Object;
  isAtLeastOwner: Boolean;
  originalReview: Object;
  body: String;
  readonly: Boolean;
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
  const [reviewBody, setReviewBody] = useState(props.body);

  const action: ReviewAction = props.originalReview
    ? props.readonly
      ? ReviewAction.COMMENT_VIEW
      : ReviewAction.COMMENT
    : ReviewAction.REVIEW;

  const placeHolder: string =
    action === ReviewAction.REVIEW
      ? TRANSLATIONS['review-body-placeholder']
      : TRANSLATIONS['review-body-comment-placeholder'];

  const handleConfirm = () => {
    const postedByRole =
      props.isAtLeastOwner && props.loggedUser?.role
        ? props.loggedUser?.role
        : 'Customer';

    if (
      action === ReviewAction.COMMENT &&
      props.loggedUser?.username !== props.originalReview?.user?.username &&
      !props.isAtLeastOwner
    ) {
      Toast.show({
        type: 'error',
        text1: TRANSLATIONS['generic-error'],
        text2: TRANSLATIONS['review-error-forbidden-comment'],
        position: 'bottom',
      });
      return;
    }

    const body = {
      pubId: props.pubId,
      username: props.loggedUser?.username,
      reviewBody,
      postedByRole,
    };

    if (action === ReviewAction.REVIEW) {
      body.score = value;
    }
    if (action === ReviewAction.COMMENT) {
      body.reviewId = props.originalReview._id;
    }

    const form: ReviewFormBody = {
      action,
      body: JSON.stringify(body),
    };

    const apiToCall =
      form.action === ReviewAction.REVIEW ? '/addReview' : '/addReviewComment';
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
          props.onConfirmForm();
        }, UTILS.reviewManager.timeoutModal);
      })
      .catch(error => {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: TRANSLATIONS['generic-error'],
          text2: TRANSLATIONS[error] ? TRANSLATIONS[error] : error,
          position: 'bottom',
        });
      });

    //props.onConfirmForm(form);
  };

  return (
    <View style={styles.container}>
      {action === ReviewAction.REVIEW && (
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
      )}
      {action === ReviewAction.COMMENT && (
        <View style={styles.originalReviewContainer}>
          <Text style={styles.originalReivewText}>
            {props.originalReview?.reviewBody}
          </Text>
        </View>
      )}
      {action !== ReviewAction.COMMENT_VIEW && (
        <View>
          <TextInput
            style={styles.textArea}
            value={reviewBody}
            multiline={true}
            onChangeText={setReviewBody}
            placeholder={placeHolder}
          />
        </View>
      )}
      {action === ReviewAction.COMMENT_VIEW && (
        <Text style={styles.originalReivewText}>{reviewBody}</Text>
      )}
      {action !== ReviewAction.COMMENT_VIEW && (
        <View>
          <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
            <Text style={styles.btnText}>
              {TRANSLATIONS['review-form-btn']}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, width: '100%'},
  dropDownContainer: {
    width: '100%',
    zIndex: 2000,
    padding: 10,
  },
  originalReviewContainer: {
    padding: 10,
  },
  originalReivewText: {
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 6,
    maxHeight: 300,
    paddingHorizontal: 5,
    paddingVertical: 100,
    minWidth: '100%',
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
