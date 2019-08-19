// diego           - 19-08-2019 - us89 - Behavior to just show label when tab is focused added on TabMainNavigator 
// josep.sanahuja  - 12-08-2019 - us85 - + UploadMatchResult in AppNoHeaderStackNavigator
// josep.sanahuja  - 06-08-2019 - us78 - + UploadMatchResultScreen
// diego           - 01-08-2019 - us58 - created NotificationTabNavigator
// diego           - 25-07-2019 - us31 - added CheckOutPaymentScreen and unnecessary code removed

import React from 'react'

import { View, Text } from 'react-native'
import {createStackNavigator, createBottomTabNavigator, createAppContainer, createMaterialTopTabNavigator, createSwitchNavigator} from 'react-navigation'

import Images from '@assets/images'

// Screens
import WelcomeOnboardingScreen from './screens/WelcomeOnboardingScreen/WelcomeOnboardingScreen'
import PublicMatchesFeedScreen from './screens/PublicMatchesFeedScreen/PublicMatchesFeedScreen'
import MyMatchesScreen from './screens/MyMatchesScreen/MyMatchesScreen';
import PublicMatchCardScreen from './screens/PublicMatchCardScreen/PublicMatchCardScreen';
import SignInScreen from './screens/SignInScreen/SignInScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen/AuthLoadingScreen';
import LoginWithEmailScreen from './screens/LoginWithEmailScreen/LoginWithEmailScreen';
import ChooseUserNameScreen from './screens/ChooseUserNameScreen/ChooseUserNameScreen';
import ChooseMatchTypeScreen from './screens/ChooseMatchTypeScreen/ChooseMatchTypeScreen';
import LoadGamesScreen from './screens/LoadGamesScreen/LoadGamesScreen';
import ChooseOpponentScreen from './screens/ChooseOpponentScreen/ChooseOpponentScreen';
import SetBetScreen from './screens/SetBetScreen/SetBetScreen';
import CheckOutPaymentScreen from './screens/CheckOutPaymentScreen/CheckOutPaymentScreen';
import ActivityNotificationsScreen from './screens/ActivityNotificationsScreen/ActivityNotificationsScreen';
import RetasNotificationsScreen from './screens/RetasNotificationsScreen/RetasNotificationsScreen';
import UploadMatchResultScreen from './screens/UploadMatchResultScreen/UploadMatchResultScreen';
import UserProfileScreen from './screens/UserProfileScreen/UserProfileScreen';

// Components
import HeaderBar from './components/HeaderBar/HeaderBar';
import NotificationsHeader from './components/NotificationsHeader/NotificationsHeader';
import BadgeForNotificationTab from './components/BadgeForNotificationTab/BadgeForNotificationTab';

// Svg Icons
const Mock1Icon = Images.svg.favouritesIcon;
const ProfileIcon = Images.svg.profileIcon;
const PublicFeedMatchIcon = Images.svg.publicFeedMatchIcon;

const NotificationTabNavigator = createMaterialTopTabNavigator(
  {
    NotificationActividad: {
      screen: ActivityNotificationsScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Actividad'
      })
    },
    NotificationRetas: {
      screen: RetasNotificationsScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Retas',
        tabBarIcon: ({ tintColor, focused }) => (
          <BadgeForNotificationTab />
        )
      })
    }
  },
  {
    initialRouteName: 'NotificationActividad',
    tabBarOptions: {
      showIcon: true,
      style: { backgroundColor: '#0C1021' },
      activeTintColor: '#36E5CE',
      inactiveTintColor: 'gray',
      indicatorStyle: {
        borderBottomColor: '#36E5CE',
        borderBottomWidth: 2,
      },
      tabStyle: {
        flexDirection: 'row-reverse'
      }
    },
  }
);

const RetasTabNavigator = createMaterialTopTabNavigator(
  {
    Publicas: {
      screen: PublicMatchesFeedScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'PÚBLICAS',
      })
    },
    MisRetas: {
      screen: MyMatchesScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'MIS RETAS'
      })
    }
  },
  {
    initialRouteName: 'Publicas',
    tabBarOptions: {
      style: { backgroundColor: '#0C1021' },
      activeTintColor: '#36E5CE',
      inactiveTintColor: 'gray',
      indicatorStyle: {
        borderBottomColor: '#36E5CE',
        borderBottomWidth: 2,
      },
    },
  }
);

const TabMainNavigator = createBottomTabNavigator({
  Retas: {
    screen:   RetasTabNavigator,
    navigationOptions: ({ navigation }) => ({
      title: "Home",  //Tried to hide this for next tab Search.,
      tabBarIcon: ({ tintColor, focused }) => (
        <View>
          <PublicFeedMatchIcon width={25} height={25} style={{ alignSelf: 'center' }} color={focused ? '#36E5CE' : 'gray'} />
          {focused && <Text style={{ color: '#36E5CE', fontSize: 12, lineHeight: 14 }}>Retas</Text>}
        </View>
      )
    })
  },
  Mock1: {
    screen:   UploadMatchResultScreen,
    navigationOptions: ({ navigation }) => ({
      //If no title it shows the name as Search.
      title: "Mock 1",
      tabBarIcon: ({ tintColor, focused }) => (
        <View>
          <Mock1Icon width={25} height={25} style={{ alignSelf: 'center' }} fill={focused ? '#36E5CE' : 'gray'}/>
          {focused && <Text style={{ color: '#36E5CE', fontSize: 12, lineHeight: 14 }}>Mock 1</Text>}
        </View>
      )
    })
  },
  Perfil: {
    screen:   UserProfileScreen,
    navigationOptions: ({ navigation }) => ({
      //If no title it shows the name as Search.
      title: 'Perfil',
      tabBarIcon: ({ tintColor, focused }) => (
        <View>
          <ProfileIcon width={25} height={25} style={{ alignSelf: 'center' }} color={focused ? '#36E5CE' : 'gray'}/> 
          {focused && <Text style={{ color: '#36E5CE', fontSize: 12, lineHeight: 14 }}>Perfil</Text>}
        </View>
      )
    })
  }
},
{ 
  tabBarOptions: {
    style: { backgroundColor: '#0C1021', height: 60, padding:0, margin:0 },
    showLabel: false,
    activeTintColor: '#36E5CE',
    tabStyle: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
});

const AppWithHeaderStackNavigator = createStackNavigator(
  {
    HomeScreen: {
      screen: TabMainNavigator
    }
  },
  {
    initialRouteName: 'HomeScreen',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }
);

const AppNoHeaderStackNavigator = createSwitchNavigator(
  {
    MatchCard: {
      screen: PublicMatchCardScreen,
    },
    ChooseMatchType: {
      screen: ChooseMatchTypeScreen
    },
    LoadGames: {
      screen: LoadGamesScreen
    },
    ChooseOponent: {
      screen: ChooseOpponentScreen
    },
    SetBet: {
      screen: SetBetScreen
    },
    CheckOut: {
      screen: CheckOutPaymentScreen
    },
    UploadMatchResult: {
      screen: UploadMatchResultScreen
    }
  }
);

export default class Router extends React.Component {

  constructor(props) {
    super(props);
  
    this.state = {};
  }

  componentDidMount() {
    
  }

  render() {
    // or not shown
    const RootStack = createStackNavigator(
      {
        SignIn: {
          screen: SignInScreen,
          navigationOptions: {
            header: null
          }
        },
        Login: {
          screen: LoginWithEmailScreen,
          navigationOptions: {
            header: null
          }
        },
        Home: {
          screen: AppWithHeaderStackNavigator,
          navigationOptions: {
            header: props => <HeaderBar {...props} />
          }
        },
        NoHeader: {
          screen: AppNoHeaderStackNavigator,
          navigationOptions: {
            header: null
          }
        },
        Notifications: {
          screen: NotificationTabNavigator,
          navigationOptions: {
            header: props => <NotificationsHeader {...props} />
          }
        }
      },
      {
        initialRouteName:  'Home'
      }
    );

    const MainNavigator = createSwitchNavigator(
      {
        AuthLoadingScreen: AuthLoadingScreen,
        App: RootStack,
        Welcome: WelcomeOnboardingScreen,
        ChooseUserNameScreen: ChooseUserNameScreen
      },
      {
        initialRouteName: 'AuthLoadingScreen'
      }
    );
    
    // Create main router entry point for the app
    const AppContainer = createAppContainer(MainNavigator);

    // render de main router entry point for the app
    return <AppContainer />
  }
}
