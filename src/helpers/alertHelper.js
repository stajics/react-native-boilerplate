import { Alert } from 'react-native';
import { get } from 'lodash';

export const errorAlert = (error) => {
  if (error.toString() === 'TypeError: Network request failed') {
    return Alert.alert('', 'Check network connection.');
  }
  if (get(error, 'message')) {
    return Alert.alert('', get(error, 'message'));
  }
  if (get(error, 'payload.message')) {
    return Alert.alert('', get(error, 'payload.message'));
  }
  if (get(error, 'errors[0].messages[0]')) {
    return Alert.alert('', get(error, 'errors[0].messages[0]'));
  }
  return Alert.alert('', error);
};
