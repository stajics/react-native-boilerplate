import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Button, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as authActions, selectors as authSelectors } from '../redux/modules/authModule';
// assets
import globalStyles from '../assets/styles';

const mapStateToProps = state => ({
  user: authSelectors.user(state),
  isLoading: authSelectors.isLoading(state),
});

const actionCreators = {
  logout: authActions.logout,
};
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actionCreators, dispatch), dispatch });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: globalStyles.colors.colorSecondary,
  },
});


class HomeContainer extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.tests = firebase.firestore().collection('test');
  }

  handleOnPressTest = async () => {
    try {
      // const res = await this.tests.add({
      //   test: `${Math.random()}`,
      // });
      // const res = await firebase.firestore().doc('test/QJ78Kg5JlbWXdCdgfY82iW3gJdn1').get();
      const res = await firebase.firestore().doc('test/QJ78Kg5JlbWXdCdgfY82iW3gJdn1').set({
        test: `${Math.random()}`,
      });
      console.log(res);
      // this.props.dispatch(NavigationActions.navigate({
      //   routeName: 'Home',
      //   params: {
      //     facebook: true,
      //   },
      // }));
    } catch (e) {
      console.log(e);
    }
  }

  handleOnPressLogout = async () => {
    try {
      const { actions } = this.props;
      const res = await actions.logout();
      if (res.error) throw res;
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <View style={[styles.container]}>
        <Button
          title="Logout"
          onPress={this.handleOnPressLogout}
        />
        <Button
          title="Test"
          onPress={this.handleOnPressTest}
        />
      </View>
    );
  }
}

HomeContainer.propTypes = {
  actions: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
