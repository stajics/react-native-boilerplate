import { NavigationActions } from 'react-navigation';

class NavigatorHelper {
  reset = (routeName, dispatch) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName }),
      ],
    });
    dispatch(resetAction);
  }

  goBack = (dispatch) => {
    dispatch(NavigationActions.back());
  }

  navigate = (routeName, dispatch, params = {}) => {
    dispatch(NavigationActions.navigate({
      routeName,
      params,
    }));
  }
}

const navigatorHelper = new NavigatorHelper();

export default navigatorHelper;
