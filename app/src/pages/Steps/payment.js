import React, {useState, useEffect} from 'react';
import {
  Container,
  Title,
  SubTitle,
  Button,
  ButtonText,
  Spacer,
} from '../../styles';

import {useDispatch} from 'react-redux';
import {updatePaymentMethod, createUser} from '../../store/modules/app/actions';
import {CreditCardInput} from 'react-native-credit-card-input';
import {Keyboard} from 'react-native';

const Payment = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(true);
  const [payment, setPayment] = useState({
    numero: null,
    nome: null,
    validade: null,
    cvv: null,
  });

  const signIn = () => {
    dispatch(updatePaymentMethod(payment));
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
        <Title>Escolher como pagar?</Title>
        <SubTitle>Preencha os dados do cartão de crédito.</SubTitle>
      </Container>
      <Container>
        <Spacer height={50} />
        <CreditCardInput
          requiresName
          onChange={(e) => {
            const {number, expiry, cvc, name} = e.values;
            setPayment({
              numero: number,
              nome: name,
              validade: expiry,
              cvv: cvc,
            });
          }}
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
