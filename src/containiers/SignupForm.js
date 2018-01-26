import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
// import firebase from 'react-native-firebase';
import { ImageBackground, ActivityIndicator, TextInput, Text, StyleSheet, Button } from 'react-native';
// utils
import { isEmpty } from 'lodash';
// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as authActions, selectors as authSelectors } from '../redux/modules/authModule';
// helpers
import { errorAlert } from '../helpers/alertHelper';
// assets
import globalStyles from '../assets/styles';

const backgroundImg = require('../assets/images/background.png');

const mapStateToProps = state => ({
  user: authSelectors.user(state),
  isLoading: authSelectors.isLoading(state),
});

const actionCreators = {
  signup: authActions.signup,
  createUser: authActions.createUser,
  login: authActions.login,
  logout: authActions.logout,
  setFirebaseUser: authActions.setFirebaseUser,
};
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actionCreators, dispatch) });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.colors.colorWhite,
  },
  textInput: {
    alignSelf: 'center',
    width: 330,
    height: 55,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: globalStyles.colors.colorSecondary,
    backgroundColor: globalStyles.colors.colorSecondary,
    paddingLeft: 10,
    borderRadius: globalStyles.borderRadius.medium,
    ...globalStyles.fonts.mediumBlack,
  },
  textInputFocused: {
    borderColor: globalStyles.colors.colorPrimary,
    backgroundColor: globalStyles.colors.colorWhite,
  },
  signupTitleText: {
    alignSelf: 'center',
    ...globalStyles.fonts.largeBlack,
    marginBottom: 21,
  },
});

class SignupForm extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      focused: '',
    };
  }

  _validateInputs = () => {
    const {
      email, password, confirmPassword,
    } = this.state;
    if (isEmpty(email) || isEmpty(password) || isEmpty(confirmPassword)) throw { errors: [{ messages: ['Type in missing fields'] }] }; // eslint-disable-line
    if (password !== confirmPassword) throw { errors: [{ messages: ['Password and repeat password must match'] }] }; // eslint-disable-line
  }

  handleInputChange = (e, inputName) => {
    this.setState({ [inputName]: e.nativeEvent.text });
  }

  handleInputFocus = (inputName) => {
    this.setState({ focused: inputName });
  }

  handleFacebookLogin = async () => {
    try {
      console.log(LoginManager.logInWithReadPermissions);
      const loginResult = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
      if (!loginResult.isCancelled) {
        console.log(`Login success with permissions: ${loginResult.grantedPermissions.toString()}`);
        // get the access token
        const accessToken = await AccessToken.getCurrentAccessToken();
        // create a new firebase credential with the token
        const credential = firebase.auth.FacebookAuthProvider.credential(accessToken.accessToken);
        // login with credential
        await firebase.auth().signInWithCredential(credential);
      }
    } catch (error) {
      console.log(`Login fail with error: ${error}`);
    }
  }

  handleOnPressSignUp = async () => {
    const { actions } = this.props;
    const { email, password } = this.state;
    try {
      this._validateInputs();
      const res = await actions.signup(email, password);
      if (res.error) throw res;
    } catch (e) {
      errorAlert(e);
    }
  }

  render() {
    const {
      email,
      password,
      confirmPassword,
      focused,
    } = this.state;
    const {
      isLoading,
    } = this.props;
    return (
      <ImageBackground
        source={backgroundImg}
        style={[styles.container]}
      >
        <Text style={[styles.signupTitleText]}>Sign up</Text>
        <TextInput
          style={[styles.textInput, (focused === 'email') && styles.textInputFocused]}
          value={email}
          onChange={(e) => { this.handleInputChange(e, 'email'); }}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Work email"
          onFocus={() => this.handleInputFocus('email')}
        />
        <TextInput
          style={[styles.textInput, (focused === 'password') && styles.textInputFocused]}
          value={password}
          secureTextEntry
          onChange={(e) => { this.handleInputChange(e, 'password'); }}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Password"
          onFocus={() => this.handleInputFocus('password')}
        />
        <TextInput
          style={[styles.textInput, (focused === 'confirmPassword') && styles.textInputFocused]}
          value={confirmPassword}
          secureTextEntry
          onChange={(e) => { this.handleInputChange(e, 'confirmPassword'); }}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Password"
          onFocus={() => this.handleInputFocus('confirmPassword')}
        />
        {
          isLoading ? <ActivityIndicator
            style={{ marginTop: 20 }}
            animating
            size="large"
            color={globalStyles.colors.colorPrimary}
          />
          :
          <Button
            title="Signup"
            onPress={this.handleOnPressSignUp}
          />
        }
        <Button
          title="Facebook Signup"
          onPress={this.handleFacebookLogin}
        />
      </ImageBackground>
    );
  }
}

SignupForm.propTypes = {
  actions: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
