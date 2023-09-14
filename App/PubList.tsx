/**@frpanico
 * UI file for PubList
 * Shows all available pubs and it is possible to interact with them
 */
import React, {useState, useEffect} from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import IMAGES from '../utilities/asset';
import UTILS from '../utilities/utils';
import {type UserInfo} from './utility/types/types';
/* Example of pub Object
const testPub = {
  name: 'Test Pub',
  owner: 'Test Owner',
  logo: require('../assets/home-guest-btn-img.jpeg'),
};
*/

type PubListProps = {
  onPubNavigate: Function;
  userInfo: UserInfo;
  onLogOut: Function;
};

const URL_SEVER_PATH = 'http://localhost:5001/api/auth/';

const PubList = ({onPubNavigate, userInfo, onLogOut}: PubListProps) => {
  const [pubs, setPubs] = useState([]);

  const onNavigateToPub = (pub: Object) => {
    console.log('# navigate to pub: ' + JSON.stringify(pub));
    onPubNavigate(pub);
  };

  const onPressLogOut = () => {
    onLogOut('Logout');
  };

  const fetchData = () => {
    fetch(UTILS.serverBasePath + '/getPubs', {
      headers: {'Content-Type': 'application/json'},
      method: 'GET',
    })
      .then(res => res.json())
      .then(res => {
        const pubList = res.pubs;
        console.log(pubList);
        handleSetPubs(pubList);
      });
  };

  const handleSetPubs = (pubList: Object[]) => {
    console.log('### Start Handling');
    const pubsToRender = pubList.map(pub => {
      return <PubTile key={pub._id} pub={pub} onSelectPub={onNavigateToPub} />;
    });
    setPubs(pubsToRender);
    console.log('# pubs: ' + JSON.stringify(pubs));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={IMAGES['home-background']}
        resizeMode="cover"
        style={styles.pubListBackgroundImage}>
        <Text style={styles.pubListHeader}>
          Welcome,{' '}
          {userInfo ? userInfo.role + ' ' + userInfo.username : 'Guest'}
        </Text>
        <View style={styles.pubListContainer}>
          <ScrollView
            style={styles.pubListContainer}
            contentContainerStyle={styles.scrollViewContainer}>
            {pubs}
          </ScrollView>
        </View>
        <View style={styles.pubListBtnContainer}>
          {userInfo && userInfo?.role === 'admin' && (
            <TouchableOpacity style={styles.pubListNewPubBtn}>
              <Text style={styles.pubListNewPubBtnTxt}>Create New Pub</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.pubListNewPubBtn}
            onPress={onPressLogOut}>
            <Text style={styles.pubListNewPubBtnTxt}>
              {userInfo ? 'Log Out' : 'Home Page'}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const PubTile = ({pub, onSelectPub}) => {
  const onPressPub = () => {
    onSelectPub(pub);
  };
  console.log(pub.logo);
  return (
    <View style={styles.tileContainer}>
      <TouchableOpacity onPress={onPressPub}>
        <ImageBackground
          style={styles.tileBackgroundImage}
          imageStyle={styles.tileBackgroundImage}
          source={IMAGES[pub.logo]}
          resizeMode="cover">
          <Text style={styles.tilePubName}>{pub.name}</Text>
          {pub.showOwner && <Text>by: {pub.owner?.username}</Text>}
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  pubListHeader: {
    fontFamily: 'sans-serif',
    fontSize: 40,
    fontWeight: '700',
    padding: 30,
  },
  pubListContainer: {flex: 2, width: '100%'},
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pubListBackgroundImage: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  pubListBtnContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  pubListNewPubBtn: {
    width: '40%',
    padding: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    backgroundColor: 'pink',
  },
  pubListNewPubBtnTxt: {textAlign: 'auto'},
  tileContainer: {flex: 1, width: '90%', padding: 8},
  tileBackgroundImage: {
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tilePubName: {fontSize: 29, fontWeight: '600'},
});

export default PubList;
