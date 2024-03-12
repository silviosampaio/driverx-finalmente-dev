import React, {useEffect} from 'react';
import {Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import social from '../../services/social';
import {useDispatch} from 'react-redux';
import {updateUser, checkUser} from '../../store/modules/app/actions';
import {Container, Button, ButtonText} from '../../styles';
import logo from '../../assets/logo.png';
import bgBottom from '../../assets/bg-bottom-login.png';

const Login = ({navigation}) => {
  const dispatch = useDispatch();

  const login = async (platform) => {
    try {
      const auth = await social.authorize(platform, {
        scopes: 'email',
      });

      const user = await social.makeRequest(
        'facebook',
        '/me?fields=id,name,email',
      );
      dispatch(
        updateUser({
          fbId: user.data.id,
          nome: user.data.name,
          email: user.data.email,
          accessToken: auth.response.credentials.accessToken,
        }),
      );
      dispatch(checkUser());
    } catch (err) {
      alert(err);
    }
  };

  const checkLogin = async () => {
    const user = await AsyncStorage.getItem('@user');
    if (user) {
      dispatch(updateUser(JSON.parse(user)));
      navigation.replace('Home');
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <Container justify="flex-end" color="info50">
      <Container
        justify="space-around"
        padding={30}
        position="absolute"
        height={270}
        top={0}
        zIndex={9}>
        <Image source={logo} />
        <Button type="info" onPress={() => login('facebook')}>
          <ButtonText color="light">Fazer Login com Facebook</ButtonText>
        </Button>
        <Button type="light">
          <ButtonText>Fazer Login com Google</ButtonText>
        </Button>
      </Container>
      <Image source={bgBottom} />
    </Container>
  );
};

export default Login;
