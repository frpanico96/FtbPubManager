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
import IMAGES from '../assets/asset';

/* Example of pub Object
const testPub = {
  name: 'Test Pub',
  owner: 'Test Owner',
  logo: require('../assets/home-guest-btn-img.jpeg'),
};
*/
const URL_SEVER_PATH = 'http://localhost:5001/api/auth/';

const PubList = ({onPubNavigate, userInfo, onLogOut}) => {
  const [pubs, setPubs] = useState([]);

  const onNavigateToPub = pub => {
    console.log('# navigate to pub: ' + JSON.stringify(pub));
    onPubNavigate(pub);
  };

  const onPressLogOut = () => {
    onLogOut('Logout');
  };

  const fetchData = () => {
    fetch(URL_SEVER_PATH + '/getPubs', {
      headers: {'Content-Type': 'application/json'},
      method: 'GET',
    })
      .then(res => res.json())
      .then(res => {
        const rawPubList = res.pubs;
        const pubList = rawPubList.reduce((accumulator, currentValue) => {
          const newPub = {
            name: currentValue.name,
            owner: currentValue.owner.username,
            showOwner: currentValue.showOwner,
            logo: currentValue.logo,
          };
          return [...accumulator, newPub];
        }, []);
        console.log(pubList);
        handleSetPubs(pubList);
      });
  };

  const handleSetPubs = pubList => {
    console.log('### Start Handling');
    const pubsToRender = pubList.map(pub => {
      return <PubTile key={pub.name} pub={pub} onSelectPub={onNavigateToPub} />;
    });
    setPubs(pubsToRender);
    console.log('# pubs: ' + JSON.stringify(pubs));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView
      style={styles.pubListContainer}
      contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
      <ImageBackground
        source={IMAGES['home-background']}
        resizeMode="cover"
        style={styles.pubListBackgroundImage}>
        <Text style={styles.pubListHeader}>
          Welcome,{' '}
          {userInfo ? userInfo.role + ' ' + userInfo.username : 'Guest'}
        </Text>
        {pubs}
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
    </ScrollView>
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
          {pub.showOwner && <Text>by: {pub.owner}</Text>}
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pubListHeader: {
    fontFamily: 'sans-serif',
    fontSize: 40,
    fontWeight: '700',
    padding: 10,
  },
  pubListContainer: {flex: 1},
  pubListBackgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pubListBtnContainer: {
    flex: 1,
    padding: 10,
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
  tileContainer: {flex: 1, width: '85%', padding: 4},
  tileBackgroundImage: {
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tilePubName: {fontSize: 29, fontWeight: '600'},
});

export default PubList;
