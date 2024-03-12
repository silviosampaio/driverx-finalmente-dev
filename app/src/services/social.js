import OAuthManager from 'react-native-social-login';

const social = new OAuthManager('drixerx');
social.configure({
  facebook: {
    client_id: '402163937641187',
    client_secret: '0db48e6e667a56f1f3b194287c53960d',
  },
  google: {
    callback_url: 'CALLBACK_URL',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_SECRET',
  },
});

export default social;
