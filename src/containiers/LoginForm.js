import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import { NavigationActions } from 'react-navigation';
// import firebase from 'react-native-firebase';
import { View, ActivityIndicator, TextInput, Text, StyleSheet, Button } from 'react-native';
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

const mapStateToProps = state => ({
  user: authSelectors.user(state),
  isLoading: authSelectors.isLoading(state),
});

const actionCreators = {
  login: authActions.login,
  logout: authActions.logout,
};
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actionCreators, dispatch), dispatch });

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
  loginTitleText: {
    alignSelf: 'center',
    ...globalStyles.fonts.largeBlack,
    marginBottom: 21,
  },
});

class LoginForm extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      focused: '',
    };
  }

  _validateInputs = () => {
    const { email, password } = this.state;
    if (isEmpty(email) || isEmpty(password)) throw { errors: [{ messages: ['Type in email and password'] }] }; // eslint-disable-line
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

  handleOnPressLogin = async () => {
    const { email, password } = this.state;
    try {
      this._validateInputs();
      const res = await this.props.actions.login(email, password);
      if (res.error) throw res;
    } catch (e) {
      errorAlert(e);
    }
  }

  handleOnPressSignup = async () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.navigate({ routeName: 'Signup' }));
  }

  render() {
    const {
      email,
      password,
      focused,
    } = this.state;
    const {
      isLoading,
    } = this.props;
    return (
      <View style={[styles.container]}>
        <Text style={[styles.loginTitleText]}>Log in</Text>
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
        {
          isLoading ? <ActivityIndicator
            style={{ marginTop: 20 }}
            animating
            size="large"
            color={globalStyles.colors.colorPrimary}
          />
          :
          <Button
            title="Login"
            onPress={this.handleOnPressLogin}
          />
        }
        <Button
          title="Facebook Login"
          onPress={this.handleFacebookLogin}
        />
        <Button
          title="Signup"
          onPress={this.handleOnPressSignup}
        />
      </View>
    );
  }
}

LoginForm.propTypes = {
  actions: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
