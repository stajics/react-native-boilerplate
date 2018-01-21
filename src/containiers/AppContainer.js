import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import { View, StyleSheet } from 'react-native';
// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as authActions, selectors as authSelectors } from '../redux/modules/authModule';
// assets
// import globalStyles from '../assets/styles';

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


class AppContainer extends Component {
  componentDidMount() {
    const { actions } = this.props;
    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      actions.updateUser(user);
    });
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() {
    const { children } = this.props;
    return (
      <View style={[styles.container]}>
        { children }
      </View>
    );
  }
}

AppContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
