import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';

// import AppRoutes from './routes/AppRoutes';
import LoginForm from './containiers/LoginForm';
import AppContainer from './containiers/AppContainer';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <AppContainer>
      <LoginForm />
    </AppContainer>
  </Provider>
);

export default App;
