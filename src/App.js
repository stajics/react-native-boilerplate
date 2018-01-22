import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';

import AppRoutes from './routes/AppRoutes';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);

export default App;
