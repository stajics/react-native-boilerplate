import { Dimensions } from 'react-native';
import colors from './colors';

const base = {
  screen: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').heigh,
  },
  borderRadius: {
    medium: 4,
  },
  shadow: {
    shadowColor: colors.colorBlack,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    elevation: 1,
  },
};

export default base;
