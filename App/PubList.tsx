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
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//import { createDrawerNavigator } from '@react-navigation/drawer';

import IMAGES from '../utilities/asset';
import UTILS from '../utilities/utils';
import TRANSLATIONS from '../translations/tranlastions';
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
  onUserReservationNavigate: Function;
};

const URL_SEVER_PATH = 'http://localhost:5001/api/auth/';
//const Drawer = createDrawerNavigator();

const PubList = ({
  onPubNavigate,
  userInfo,
  onLogOut,
  onUserReservationNavigate,
}: PubListProps) => {
  const [pubs, setPubs] = useState({
    pubs: [],
    showMyPubs: false,
    allPubs: [],
  });
  // const [pubs, setPubs] = useState([]);
  // const [filter, setFilter] = useState(false);

  const onNavigateToPub = (pub: Object) => {
    console.log('# navigate to pub: ' + JSON.stringify(pub));
    onPubNavigate(pub);
  };

  const handleUserReservationBtn = () => {
    console.log('# navigating to user reservations');
    onUserReservationNavigate();
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
        setPubs(prev => {
          const newState = {...prev};
          newState.pubs = pubList;
          newState.allPubs = pubList;
          newState.showMyPubs = false;
          return newState;
        });
      });
  };

  const showMyPubs = () => {
    let myPubsOnly = [];
    if (!pubs?.showMyPubs) {
      myPubsOnly = pubs.pubs.filter(pub => {
        console.log(pub);
        console.log(pub?.owner?.username);
        console.log(userInfo.username);
        return pub?.owner?.username === userInfo.username;
      });
    }

    setPubs(prev => {
      const newState = {...prev};
      newState.pubs = !prev.showMyPubs ? myPubsOnly : prev.allPubs;
      newState.showMyPubs = !prev.showMyPubs;
      return newState;
    });
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
        <View style={styles.headerContainer}>
          {Platform.OS === 'ios' && userInfo && (
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={handleUserReservationBtn}>
                <Icon name="menu-open" size={50} color="#900" />
              </TouchableOpacity>
              {userInfo.role === 'owner' && (
                <TouchableOpacity onPress={showMyPubs}>
                  <Icon
                    name={pubs?.showMyPubs ? 'filter-off' : 'filter'}
                    size={35}
                    color="#900"
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          <Text style={styles.pubListHeader}>
            {TRANSLATIONS['publist-welcome']} {','}{' '}
            {userInfo ? userInfo.username : 'Guest'}
          </Text>
        </View>
        <View style={styles.pubListContainer}>
          <ScrollView
            style={styles.pubListContainer}
            contentContainerStyle={styles.scrollViewContainer}>
            {pubs &&
              pubs?.pubs?.length > 0 &&
              pubs.pubs.map(pub => (
                <PubTile
                  key={pub._id}
                  pub={pub}
                  onSelectPub={onNavigateToPub}
                />
              ))}
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
              {userInfo
                ? TRANSLATIONS['publist-logout']
                : TRANSLATIONS['publist-home-btn']}
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
          {pub.showOwner && (
            <Text>
              {TRANSLATIONS['publist-by']}: {pub.owner?.username}
            </Text>
          )}
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

// const TestComponent = () => {
//   return <Text>Finally</Text>;
// }

// const SideMenu = () => {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen name="SideBar" component={TestComponent} />
//     </Drawer.Navigator>
//   );
// }

// const SideBar = () => {
//   const menu = <Text>Hello</Text>;
//   return (
//     <SideMenu menu={menu}>
//       <Text>Hello</Text>
//     </SideMenu>
//   );
// }

const styles = StyleSheet.create({
  container: {flex: 1},
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pubListHeader: {
    fontFamily: 'sans-serif',
    fontSize: 30,
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
