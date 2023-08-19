/**@frpanico
 * Main page after selecting a Pub
 * It shows list of potential actions a user can take
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import IMAGES from '../assets/asset';
import UTILS from '../utilities/utils';

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

const PubMain: JSX.Element = ({navigation, route}) => {
  console.log('### Route Params: ' + JSON.stringify(route.params));
  console.log(PUB_UTILS);

  const onPressAction = ({actionName}) => {
    console.log('### Action pressed: ' + actionName);
  };

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
            additionalText="Feature is available only for logged users"
            pubAction={tile}
            onSelectAction={onPressAction}
          />
        );
      }
    } else if (manageReservation) {
      if (
        route.params.userInfo &&
        (route.params.userInfo?.role === 'admin' ||
          (route.params.userInfo.role === 'owner' &&
            route.params.userInfo.username === route.params.pub.owner))
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
    <View style={sytles.container}>
      <ImageBackground
        source={IMAGES['home-background']}
        resizeMode="cover"
        style={sytles.containerBackgroundImg}>
        <View style={sytles.pubMainHeader}>
          <Text style={sytles.pubNameText}>{route.params.pub.name}</Text>
          {route.params.pub.showOwner && (
            <Text style={sytles.pubOwnerText}>
              by: {route.params.pub.owner}
            </Text>
          )}
        </View>
        {pubTiles}
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
    onSelectAction({actionName: pubAction.name});
  };

  return (
    <View style={sytles.btnContainer}>
      <TouchableOpacity
        disabled={disabled}
        style={sytles.btnTouchable}
        onPress={onPressTile}>
        <ImageBackground
          source={IMAGES['pub-main-btn']}
          resizeMode="cover"
          style={sytles.btnBackgroundImage}
          imageStyle={sytles.btnBackgroundInsideImage}>
          <Text style={sytles.btnText}>{pubAction.label}</Text>
          {additionalText && (
            <Text style={sytles.btnAdditionalText}>{additionalText}</Text>
          )}
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const sytles = StyleSheet.create({
  container: {flex: 1},
  containerBackgroundImg: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  pubMainHeader: {
    padding: 4,
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
});

export default PubMain;
