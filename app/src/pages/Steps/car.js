import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {updateCar, createUser} from '../../store/modules/app/actions';

import {
  Container,
  Title,
  SubTitle,
  Button,
  ButtonText,
  Spacer,
  Input,
} from '../../styles';

import {Keyboard} from 'react-native';

const Payment = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(true);
  const [car, setCar] = useState({
    placa: null,
    marca: null,
    modelo: null,
    cor: null,
  });

  const signIn = () => {
    dispatch(updateCar(car));
    dispatch(createUser());
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setVisible(false),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setVisible(true),
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Container justify="flex-start" padding={30}>
      <Container align="flex-start" height={40}>
        <Title>Cadastre seu veículo.</Title>
        <SubTitle>Preencha os dados do cartão de crédito.</SubTitle>
      </Container>
      <Container justify="flex-start">
        <Spacer height={50} />
        <Input
          onChangeText={(placa) => {
            setCar({...car, placa});
          }}
          value={car.placa}
          placeholder="Placa do veículo"
        />
        <Spacer />
        <Input
          onChangeText={(marca) => {
            setCar({...car, marca});
          }}
          value={car.marca}
          placeholder="Marca do veículo"
        />
        <Spacer />
        <Input
          onChangeText={(modelo) => {
            setCar({...car, modelo});
          }}
          value={car.modelo}
          placeholder="Modelo do veículo"
        />
        <Spacer />
        <Input
          onChangeText={(cor) => {
            setCar({...car, cor});
          }}
          value={car.cor}
          placeholder="Cor do veículo"
        />
      </Container>
      {visible && (
        <Container height={70} justify="flex-end">
          <Button onPress={() => signIn()}>
            <ButtonText>Começar a usar</ButtonText>
          </Button>
        </Container>
      )}
    </Container>
  );
};

export default Payment;
