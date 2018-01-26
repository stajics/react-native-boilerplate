import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker, View, TextInput, StyleSheet, Button } from 'react-native';
// assets
import globalStyles from '../assets/styles';

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
});

class ProfileEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name || '',
      username: props.username || '',
      gender: props.gender || 'male',
      quote: props.quote || '',
    };
  }

  handleInputChange = (e, inputName) => {
    this.setState({ [inputName]: e.nativeEvent.text });
  }

  handleInputFocus = (inputName) => {
    this.setState({ focused: inputName });
  }

  render() {
    const { onDonePress } = this.props;
    const {
      name, username, gender, quote, focused,
    } = this.state;
    return (
      <View style={[styles.container]}>
        <TextInput
          style={[styles.textInput, (focused === 'name') && styles.textInputFocused]}
          value={name}
          onChange={(e) => { this.handleInputChange(e, 'name'); }}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="name"
          onFocus={() => this.handleInputFocus('name')}
        />
        <TextInput
          style={[styles.textInput, (focused === 'username') && styles.textInputFocused]}
          value={username}
          onChange={(e) => { this.handleInputChange(e, 'username'); }}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="username"
          onFocus={() => this.handleInputFocus('username')}
        />
        <Picker
          selectedValue={gender}
          onValueChange={itemValue => this.setState({ gender: itemValue })}
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
        <TextInput
          style={[styles.textInput, (focused === 'quote') && styles.textInputFocused]}
          value={quote}
          onChange={(e) => { this.handleInputChange(e, 'quote'); }}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="quote"
          onFocus={() => this.handleInputFocus('quote')}
        />
        <Button
          title="Done"
          onPress={() => onDonePress(name, username, gender, quote)}
        />
      </View>
    );
  }
}

ProfileEdit.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string,
  gender: PropTypes.string,
  quote: PropTypes.string,
  onDonePress: PropTypes.func.isRequired,
};

export default ProfileEdit;
