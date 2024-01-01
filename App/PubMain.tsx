/**@frpanico
 * Main page after selecting a Pub
 * It shows list of potential actions a user can take
 */
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import IMAGES from '../utilities/asset';
import UTILS from '../utilities/utils';
import TRANSLATIONS from '../translations/tranlastions';

type PubActionObj = {
  name: string;
  label: string;
};

type PubTileProps = {
  pubAction: PubActionObj;
  disabled: Boolean;
  additionalText: String;
  onSelectAction: Function;
};

const PUB_UTILS = UTILS.pubMain;

const PubMain = ({navigation, route}) => {
  console.log('### Route Params: ' + JSON.stringify(route.params));
  console.log(PUB_UTILS);

  const [selectedPub, setSelectedPub] = useState({});

  const onPressAction = (actionName: String) => {
    console.log('### Action pressed: ' + actionName);
    navigation.navigate({
      name: 'PubMainManager',
      params: {
        userInfo: route.params?.userInfo,
        pub: selectedPub,
        cmp: actionName,
      },
      merge: true,
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const fetchPub = (pubId: String) => {
    fetch(UTILS.serverBasePath + '/getPub', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({pubId}),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log('FetchedPub', jsonRes.pub);
        setSelectedPub(jsonRes.pub);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchPub(route.params?.pub._id);
    }, [route.params?.pub._id]),
  );

  const pubTilesRaw = PUB_UTILS.map(tile => {
    const manageReservation =
      tile.name === 'pub-main-manage-reservation' ||
      tile.name === 'pub-main-manage-menu';
    if (tile.name === 'pub-main-resevation') {
      if (route.params.userInfo) {
        return (
          <PubMainTile
            key={tile.name}
            pubAction={tile}
            onSelectAction={onPressAction}
          />
        );
      } else {
        return (
          <PubMainTile
            key={tile.name}
            disabled={true}
            additionalText="pub-main-user-only-feature"
            pubAction={tile}
            onSelectAction={onPressAction}
          />
        );
      }
    } else if (manageReservation) {
      if (
        route.params.userInfo /*&&
        (route.params.userInfo?.role === 'admin' ||
          (route.params.userInfo.role === 'owner' &&
            route.params.userInfo.username === route.params.pub.owner))*/
      ) {
        return (
          <PubMainTile
            key={tile.name}
            pubAction={tile}
            onSelectAction={onPressAction}
          />
        );
      } else {
        return null;
      }
    } else if (tile.name === 'pub-main-close-pub') {
      if (route.params.userInfo?.role === 'admin') {
        return (
          <PubMainTile
            key={tile.name}
            pubAction={tile}
            onSelectAction={onPressAction}
          />
        );
      } else {
        return null;
      }
    } else if (tile.name === 'pub-main-review') {
      return (
        <PubMainTile
          key={tile.name}
          disabled={false}
          pubAction={tile}
          additionalText={
            route.params?.userInfo ? '' : 'pub-main-user-only-reviews'
          }
          onSelectAction={onPressAction}
        />
      );
    } else {
      return (
        <PubMainTile
          key={tile.name}
          pubAction={tile}
          onSelectAction={onPressAction}
        />
      );
    }
  });

  const pubTiles = pubTilesRaw.filter(el => el !== null);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={IMAGES['home-background']}
        resizeMode="cover"
        style={styles.containerBackgroundImg}>
        <View style={styles.pubMainHeader}>
          <Text style={styles.pubNameText}>{route.params.pub.name}</Text>
          {route.params.pub.showOwner && (
            <Text style={styles.pubOwnerText}>
              {TRANSLATIONS['publist-by']}: {route.params.pub.owner?.username}
            </Text>
          )}
        </View>
        {pubTiles}
        <View style={styles.goBackBtnContainer}>
          <TouchableOpacity style={styles.goBackBtn} onPress={handleGoBack}>
            <Text style={styles.goBackBtnTxt}>
              {TRANSLATIONS['go-back-btn']}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const PubMainTile: React.FC<PubTileProps> = ({
  pubAction,
  disabled = false,
  additionalText,
  onSelectAction,
}) => {
  const onPressTile = () => {
    onSelectAction(pubAction.name);
  };

  return (
    <View style={styles.btnContainer}>
      <TouchableOpacity
        disabled={disabled}
        style={styles.btnTouchable}
        onPress={onPressTile}>
        <ImageBackground
          source={IMAGES['pub-main-btn']}
          resizeMode="cover"
          style={styles.btnBackgroundImage}
          imageStyle={styles.btnBackgroundInsideImage}>
          <Text style={styles.btnText}>{pubAction.label}</Text>
          {additionalText && (
            <Text style={styles.btnAdditionalText}>
              {TRANSLATIONS[additionalText]}
            </Text>
          )}
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  containerBackgroundImg: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  pubMainHeader: {
    padding: 4,
    paddingTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pubNameText: {fontFamily: 'sans-serif', fontSize: 30, fontWeight: '700'},
  pubOwnerText: {fontFamily: 'sans-serif', fontSize: 20},
  btnContainer: {flex: 1, width: '85%', padding: 4},
  btnBackgroundImage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '80%',
  },
  btnBackgroundInsideImage: {
    borderRadius: 6,
    borderWidth: 1,
    height: '100%',
  },
  btnTouchable: {},
  btnText: {fontSize: 18, textAlign: 'center', color: 'white'},
  btnAdditionalText: {textAlign: 'center', color: 'white'},
  goBackBtnContainer: {flex: 1, justifyContent: 'center'},
  goBackBtn: {
    width: '40%',
    backgroundColor: 'pink',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 6,
    padding: 10,
  },
  goBackBtnTxt: {fontSize: 18},
});

export default PubMain;
