import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';

// import AppRoutes from './routes/AppRoutes';
import LoginForm from './containiers/LoginForm';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <LoginForm />
  </Provider>
);

export default App;
