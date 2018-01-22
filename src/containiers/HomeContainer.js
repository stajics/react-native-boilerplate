import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Button, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
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
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actionCreators, dispatch) });

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

  handleOnPressLogout = async () => {
    try {
      const { actions, navigation } = this.props;
      const res = await actions.logout();
      if (res.error) throw res;
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Login' }),
        ],
      });
      navigation.dispatch(resetAction);
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
      </View>
    );
  }
}

HomeContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
