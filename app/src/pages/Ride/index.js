import React, {useState} from 'react';
import {useDispatch} from 'react-redux';

import {
  Container,
  Title,
  SubTitle,
  Button,
  ButtonText,
  Input,
  AddressList,
  AddressItem,
} from '../../styles';
import {TouchableOpacity} from 'react-native';

import api from '../../services/api';
import {getRideInfos} from '../../store/modules/app/actions';

const Ride = ({navigation}) => {
  const dispatch = useDispatch();
  const [activeInput, setActiveInput] = useState(null);
  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});
  const [list, setList] = useState([]);

  const getPlaces = async (address) => {
    try {
      const response = await api.get(`/address/${address}`);
      const res = response.data;

      if (res.error) {
        alert(res.message);
        return false;
      }

      setList(res.list);
    } catch (err) {
      alert(err.message);
    }
  };

  const getRide = async () => {
    try {
      dispatch(getRideInfos(origin.place_id, destination.place_id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Container row height={50} justify="flex-start">
        <Container align="flex-start" padding={20}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <SubTitle>Voltar</SubTitle>
          </TouchableOpacity>
        </Container>
        <Container>
          <Title>Ride</Title>
        </Container>
        <Container align="flex-end" padding={20}></Container>
      </Container>
      <Container padding={20} justify="flex-start">
        <Container height={90} justify="flex-start">
          <Input
            onFocus={() => setActiveInput('setOrigin')}
            placeholder="Embarque"
            value={origin.description}
            onChangeText={(address) => getPlaces(address)}
          />
          <Input
            onFocus={() => setActiveInput('setDestination')}
            placeholder="Destino"
            value={destination.description}
            onChangeText={(address) => getPlaces(address)}
          />
        </Container>
        <Container>
          <AddressList
            data={list}
            keyExtractor={(item) => item.place_id}
            renderItem={({item, index}) => (
              <AddressItem onPress={() => eval(activeInput)(item)} key={index}>
                <SubTitle bold>{item.description}</SubTitle>
                <SubTitle small>{item.secondary_text}</SubTitle>
              </AddressItem>
            )}
          />
        </Container>
      </Container>
      <Container height={70} padding={20}>
        <Button onPress={() => getRide()}>
          <ButtonText>Atualizar no mapa</ButtonText>
        </Button>
      </Container>
    </>
  );
};

export default Ride;
