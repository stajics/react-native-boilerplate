import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { StackNavigator, NavigationActions, addNavigationHelpers } from 'react-navigation';
import firebase from 'react-native-firebase';
// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as authActions, selectors as authSelectors } from './redux/modules/authModule';
import { selectors as navigatorSelectors } from './redux/modules/navigatorModule';
// containers
import ModalManager from './containiers/ModalManager';
import LoginForm from './containiers/LoginForm';
import HomeContainer from './containiers/HomeContainer';

export const AppNavigator = StackNavigator({
  Login: {
    screen: LoginForm,
  },
  Home: {
    screen: HomeContainer,
  },
}, {
  initialRouteName: 'Login',
});

const mapStateToProps = state => ({
  navigator: navigatorSelectors.navigator(state),
  user: authSelectors.user(state),
  isLoading: authSelectors.isLoading(state),
});

const actionCreators = {
  getUser: authActions.getUser,
  setToken: authActions.setToken,
  updateUser: authActions.updateUser,
};
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actionCreators, dispatch), dispatch });

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class App extends Component {
  componentDidMount() {
    const { actions, dispatch } = this.props;
    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      actions.updateUser(user);
      if (user) {
        dispatch(NavigationActions.navigate({ routeName: 'Home' }));
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() {
    const { dispatch, navigator } = this.props;
    return (
      <View style={[styles.container]}>
        <ModalManager />
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
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
