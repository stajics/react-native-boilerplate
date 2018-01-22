import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as authActions, selectors as authSelectors } from '../redux/modules/authModule';
// containers
import ModalManager from '../containiers/ModalManager';
import LoginForm from '../containiers/LoginForm';
import HomeContainer from '../containiers/HomeContainer';

const RoutesStack = StackNavigator({
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
  user: authSelectors.user(state),
  isLoading: authSelectors.isLoading(state),
});

const actionCreators = {
  getUser: authActions.getUser,
  setToken: authActions.setToken,
  updateUser: authActions.updateUser,
};
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actionCreators, dispatch) });

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class AppRoutes extends Component {
  componentDidMount() {
    const { actions } = this.props;
    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      actions.updateUser(user);
      if (user) {
        this.navigator.dispatch(NavigationActions.navigate({ routeName: 'Home' }));
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() {
    return (
      <View style={[styles.container]}>
        <ModalManager />
        <RoutesStack ref={(nav) => { this.navigator = nav; }} />
      </View>
    );
  }
}

AppRoutes.propTypes = {
  actions: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRoutes);
