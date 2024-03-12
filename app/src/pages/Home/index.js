import React, {useState, useEffect, useRef} from 'react';
import {Dimensions, Alert, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Marker, Polyline} from 'react-native-maps';

import api from '../../services/api';
import social from '../../services/social';
import socket from '../../controller/socket';
import {
  requestRide,
  updateRide,
  acceptRide,
} from '../../store/modules/app/actions';

import driverIcon from '../../assets/driver.png';
import initialMarker from '../../assets/initial-marker.png';
import finalMarker from '../../assets/final-marker.png';
import {
  Map,
  Container,
  Avatar,
  Title,
  SubTitle,
  Spacer,
  Input,
  Button,
  ButtonText,
  VerticalSeparator,
  Bullet,
  PulseCircle,
} from '../../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation}) => {
  const ws = useRef(null);
  const mapRef = useRef(null);
  const dispatch = useDispatch();

  const {user, ride} = useSelector((state) => state.app);
  const [driverLocation, setDriverLocation] = useState({
    latitude: -30.011364,
    longitude: -51.1637373,
  });

  const canViewAvatar = user.tipo === 'M' || (user.tipo === 'P' && !ride?.info);
  const rideStatus = () => {
    if (ride?.user?._id) {
      if (ride?.driver?._id) {
        return 'inRide';
      } else {
        return 'inSearch';
      }
    }
    return 'empty';
  };

  const logoff = async () => {
    /*await social.makeRequest(
      'facebook',
      `/${user.fbId}/permissions?access_token=${user.accessToken}`,
      {
        method: 'delete',
      },
    );
    await social.deauthorize('facebook');*/
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  const updateLocation = async (coordinates) => {
    try {
      await api.put(`/location/${user._id}`, {
        coordinates,
        socketId: ride?.user?.socketId,
        status: rideStatus(),
      });
    } catch (err) {
      console.log('update location error => ' + err.message);
    }
  };

  const updateMapLocation = async (coordinates) => {
    if (user.tipo === 'P') {
      setDriverLocation({
        ...driverLocation,
        latitude: coordinates[0],
        longitude: coordinates[1],
      });
      mapRef.current.animateCamera({
        center: {
          latitude: coordinates[0],
          longitude: coordinates[1],
        },
        zoom: 14,
      });
    }
  };

  const updateSocketId = async (socketId) => {
    try {
      await api.put(`/socket/${user._id}`, {socketId});
      console.log('socket update success');
    } catch (err) {
      console.log('update socketId error => ' + err.message);
    }
  };

  const rideRequest = async () => {
    dispatch(requestRide());
  };

  const rideAccept = async () => {
    dispatch(acceptRide());
  };

  const initSocket = () => {
    // INIT SOCKET
    ws.current = socket();

    ws.current.on('connect', () => {
      const id = ws.current.id;
      updateSocketId(id);

      ws.current.on('ride-request', (ride) => {
        dispatch(updateRide(ride));
      });

      ws.current.on('ride', (ride) => {
        dispatch(updateRide(ride));
      });

      ws.current.on('ride-update', (coordinates) => {
        updateMapLocation(coordinates);
      });

      ws.current.on('ride-cancel', (data) => {});
    });
  };

  useEffect(() => {
    initSocket();
  }, []);

  useEffect(() => {
    mapRef.current.fitToCoordinates(ride?.info?.route, {
      options: {
        edgePadding: {
          top: 100,
          right: 70,
          bottom: 150,
          left: 70,
        },
      },
    });
  }, [ride]);

  return (
    <Container>
      <Map
        disabled={user.tipo === 'P' && rideStatus() === 'inSearch'}
        ref={mapRef}
        initialRegion={{
          latitude: -30.011364,
          longitude: -51.1637373,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChangeComplete={(region) => {
          if (user.tipo === 'M') {
            // UPDATE SOCKET
            setDriverLocation(region);
            updateLocation([region.latitude, region.longitude]);
          }
        }}>
        {(ride?._id || user.tipo === 'M') && (
          <Marker coordinate={driverLocation}>
            <Avatar source={driverIcon} small />
          </Marker>
        )}

        {ride?.info?.route && (
          <>
            <Polyline
              coordinates={ride?.info?.route}
              strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
              strokeWidth={4}
            />

            <Marker coordinate={ride?.info?.route[0]}>
              <Avatar source={initialMarker} small />
            </Marker>

            <Marker
              coordinate={ride?.info?.route[ride?.info?.route.length - 1]}>
              <Avatar source={finalMarker} small />
            </Marker>
          </>
        )}
      </Map>
      <Container
        position="absolute"
        justify="space-between"
        align="flex-start"
        padding={20}
        zIndex={999}
        pointerEvents="box-none"
        style={{height: '100%'}}>
        <Container height={100} justify="flex-start" align="flex-start">
          {/* AVATAR */}
          {canViewAvatar && (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Tem certeza?',
                  'Você realmente deseja sair?',
                  [
                    {
                      text: 'Não, permanecer logado.',
                      style: 'cancel',
                    },
                    {text: 'Sim, Quero Sair.', onPress: () => logoff()},
                  ],
                  {cancelable: false},
                );
              }}>
              <Avatar
                source={{
                  uri: `https://graph.facebook.com/${user.fbId}/picture?type=large&access_token=${user.accessToken}`,
                }}
              />
            </TouchableOpacity>
          )}

          {/* USUARIO COM INFORMAÇÕES DA CORRIDA */}
          {!canViewAvatar && (
            <Container elevation={50} justify="flex-end" color="light">
              <Container padding={20}>
                <Container justify="flex-start" row>
                  <Bullet />
                  <SubTitle numberOfLines={1}>
                    {' '}
                    {ride?.info.start_address}
                  </SubTitle>
                </Container>
                <Spacer height={20} />
                <Container justify="flex-start" row>
                  <Bullet destination />
                  <SubTitle numberOfLines={1}>
                    {' '}
                    {ride?.info.end_address}
                  </SubTitle>
                </Container>
              </Container>
              <Button type="dark" compact>
                <ButtonText color="light">Toque para editar</ButtonText>
              </Button>
            </Container>
          )}
        </Container>

        {/* USUARIO PROCURANDO CORRIDA */}
        {user.tipo === 'P' && rideStatus() === 'inSearch' && (
          <Container padding={20} zIndex={-1}>
            <PulseCircle
              numPulses={3}
              diameter={400}
              speed={20}
              duration={2000}
            />
          </Container>
        )}

        <Container elevation={50} height={150} color="light">
          {/* USUÁRIO SEM CORRIDA */}
          {user.tipo === 'P' && !ride?.info && (
            <Container justify="flex-start" padding={20} align="flex-start">
              <SubTitle>Olá, {user.nome}.</SubTitle>
              <Title>Pra onde você quer ir?</Title>
              <Spacer />
              <TouchableOpacity
                style={{width: '100%'}}
                onPress={() => navigation.navigate('Ride')}>
                <Input editable={false} placeholder="Procure um destino..." />
              </TouchableOpacity>
            </Container>
          )}

          {/* USUÁRIO CORRIDA PENDENTE */}
          {user.tipo === 'P' && ride?.info && rideStatus() !== 'inRide' && (
            <Container justify="flex-end" align="flex-start">
              <Container padding={20}>
                <SubTitle>Driverx Convencional</SubTitle>
                <Spacer />
                <Container row>
                  <Container>
                    <Title>R$ {ride.info.price}</Title>
                  </Container>
                  <VerticalSeparator />
                  <Container>
                    <Title>{ride.info.duration.text}</Title>
                  </Container>
                </Container>
              </Container>
              <Button
                type={rideStatus() === 'inSearch' ? 'muted' : 'primary'}
                onPress={() => rideRequest()}>
                <ButtonText>
                  {rideStatus() === 'inSearch'
                    ? 'Cancelar Driverx'
                    : 'Chamar Driverx'}
                </ButtonText>
              </Button>
            </Container>
          )}

          {/* USUÁRIO EM CORRIDA */}
          {user.tipo === 'P' && ride?.info && rideStatus() === 'inRide' && (
            <Container border="primary" justify="flex-end" align="flex-start">
              <Container>
                <Container row>
                  <Container align="flex-start" padding={20} row>
                    <Avatar
                      small
                      source={{
                        uri: `https://graph.facebook.com/${ride?.driver.fbId}/picture?type=large&access_token=${ride?.driver.accessToken}`,
                      }}
                    />
                    <Spacer width="10px" />
                    <Container align="flex-start">
                      <SubTitle bold>
                        {ride?.driver.nome} ({ride?.info.distance.text})
                      </SubTitle>
                      <Container justify="flex-start">
                        <SubTitle numberOfLines={1} small>
                          {`${ride?.car.placa} - ${ride?.car.marca}, ${ride?.car.modelo} - ${ride?.car.cor}`}
                        </SubTitle>
                      </Container>
                    </Container>
                  </Container>
                  <VerticalSeparator />
                  <Container width={40}>
                    <Title>R$ {ride?.info.price}</Title>
                    <SubTitle bold color="primary">
                      Aprox. {ride?.info.duration.text}
                    </SubTitle>
                  </Container>
                </Container>
              </Container>
              <Button type="muted">
                <ButtonText>Cancelar Corrida</ButtonText>
              </Button>
            </Container>
          )}

          {/* MOTORISTA COM CORRIDA */}
          {user.tipo === 'M' && ride?.info && (
            <Container border="primary" justify="flex-end" align="flex-start">
              <Container>
                <Container row>
                  <Container align="flex-start" padding={20} row>
                    <Avatar
                      small
                      source={{
                        uri: `https://graph.facebook.com/${ride?.user.fbId}/picture?type=large&access_token=${ride?.user.accessToken}`,
                      }}
                    />
                    <Spacer width="10px" />
                    <Container align="flex-start">
                      <SubTitle bold>
                        {ride?.user.nome} ({ride?.info.distance.text})
                      </SubTitle>
                      <Container justify="flex-start" row>
                        <Bullet />
                        <SubTitle numberOfLines={1} small>
                          {' '}
                          {ride?.info.start_address}
                        </SubTitle>
                      </Container>
                      <Container justify="flex-start" row>
                        <Bullet destination />
                        <SubTitle numberOfLines={1} small>
                          {' '}
                          {ride?.info.end_address}
                        </SubTitle>
                      </Container>
                    </Container>
                  </Container>
                  <VerticalSeparator />
                  <Container width={40}>
                    <Title>R$ {ride?.info.price}</Title>
                    <SubTitle bold color="primary">
                      Aprox. {ride?.info.duration.text}
                    </SubTitle>
                  </Container>
                </Container>
              </Container>
              <Button
                type={rideStatus('M') !== 'inRide' ? 'primary' : 'muted'}
                onPress={() => rideAccept()}>
                <ButtonText>
                  {rideStatus('M') !== 'inRide'
                    ? 'Aceitar Corrida'
                    : 'Cancelar Corrida'}
                </ButtonText>
              </Button>
            </Container>
          )}

          {/* MOTORISTA SEM CORRIDA */}
          {user.tipo === 'M' && !ride?.info && (
            <Container>
              <SubTitle>Olá, {user.nome}.</SubTitle>
              <Title>Nenhuma corrida encontrada.</Title>
            </Container>
          )}
        </Container>
      </Container>
    </Container>
  );
};

export default Home;
