import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import { get, isEmpty } from 'lodash';
// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as authActions, selectors as authSelectors } from '../redux/modules/authModule';
// components
import ProfileEdit from '../components/ProfileEdit';
// helpers
import { errorAlert } from '../helpers/alertHelper';
import NavigatorHelper from '../helpers/navigatorHelper';

const mapStateToProps = state => ({
  user: authSelectors.user(state),
  firebaseUser: authSelectors.firebaseUser(state),
  isLoading: authSelectors.isLoading(state),
});

const actionCreators = {
  logout: authActions.logout,
  createUser: authActions.createUser,
  editUser: authActions.editUser,
};
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actionCreators, dispatch), dispatch });


class ProfileEditContainer extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.users = firebase.firestore().collection('users');
  }

  _validateInputs = (name, username, gender) => {
    if (isEmpty(name) || isEmpty(username) || isEmpty(gender)) throw { errors: [{ messages: ['Type in required fields'] }] }; // eslint-disable-line
  }

  handleProfileEdit = async (name, username, gender, quote) => {
    try {
      const { actions, dispatch } = this.props;
      this._validateInputs(name, username, gender);
      const isSignup = get(this.props, 'navigation.state.params.isSignup');
      let user = null;
      if (isSignup) {
        user = await actions.createUser({
          displayName: name,
          username,
          gender,
          quote,
          completed: true,
          isNew: true,
        });
      } else {
        user = await actions.editUser({
          displayName: name,
          username,
          gender,
          quote,
          completed: true,
        });
      }
      if (user.error) throw user;

      if (isSignup) {
        // TODO redirect to intro
        NavigatorHelper.reset('Home', dispatch);
      } else {
        NavigatorHelper.goBack(dispatch);
      }
    } catch (e) {
      errorAlert(e);
    }
  }

  render() {
    const { user } = this.props;
    return (
      <ProfileEdit
        onDonePress={this.handleProfileEdit}
        name={user && user.displayName}
        username={user && user.username}
        gender={user && user.gender}
        quote={user && user.quote}
      />
    );
  }
}

ProfileEditContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  user: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditContainer);
