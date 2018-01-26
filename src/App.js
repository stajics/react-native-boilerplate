import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { StackNavigator, NavigationActions, addNavigationHelpers } from 'react-navigation';
import firebase from 'react-native-firebase';
// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as authActions } from './redux/modules/authModule';
import { selectors as navigatorSelectors } from './redux/modules/navigatorModule';
import { selectors as appSelectors } from './redux/modules/appModule';
// containers
import LoginForm from './containiers/LoginForm';
import SignupForm from './containiers/SignupForm';
import HomeContainer from './containiers/HomeContainer';
import ProfileEditContainer from './containiers/ProfileEditContainer';

export const AppNavigator = StackNavigator({
  Login: {
    screen: LoginForm,
  },
  Signup: {
    screen: SignupForm,
  },
  ProfileEdit: {
    screen: ProfileEditContainer,
  },
  Home: {
    screen: HomeContainer,
  },
}, {
  initialRouteName: 'Login',
});

const mapStateToProps = state => ({
  navigator: navigatorSelectors.navigator(state),
  isStartingUp: appSelectors.isStartingUp(state),
});

const actionCreators = {
  getUser: authActions.getUser,
  setFirebaseUser: authActions.setFirebaseUser,
};
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actionCreators, dispatch), dispatch });

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appStartupLoading: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'red',
    zIndex: 10,
  },
});

class App extends Component {
  componentDidMount() {
    const { actions, dispatch } = this.props;
    this.unsubscriber = firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      actions.setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        const user = await actions.getUser(firebaseUser._user.uid);
        if (!user || !user.completed) {
          dispatch(NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'ProfileEdit',
                params: {
                  isSignup: true,
                },
              }),
            ],
          }));
        } else {
          dispatch(NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'Home',
              }),
            ],
          }));
        }
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() {
    const { dispatch, navigator, isStartingUp } = this.props;
    return (
      <View style={[styles.container]}>
        {isStartingUp && <View style={[styles.appStartupLoading]} />}
        <AppNavigator navigation={addNavigationHelpers({
          dispatch,
          state: navigator,
        })}
        />
      </View>
    );
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired,
  isStartingUp: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
