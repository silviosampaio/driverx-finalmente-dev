import styled from 'styled-components/native';
import theme from './theme.json';

import MapView from 'react-native-maps';
import Pulse from 'react-native-pulse';

export const Container = styled.View`
  flex: 1;
  flex-direction: ${(props) => (props.row ? 'row' : 'column')};
  background: ${(props) =>
    props.color ? theme.colors[props.color] : 'transparent'};
  justify-content: ${(props) => (props.justify ? props.justify : 'center')};
  padding: ${(props) => (props.padding ? props.padding : 0)}px;
  width: 100%;
  align-items: ${(props) => (props.align ? props.align : 'center')};
  max-width: ${(props) => (!props.width ? 100 : props.width)}%;
  max-height: ${(props) => (props.height ? props.height + 'px' : 'auto')};
  position: ${(props) => (props.position ? props.position : 'relative')};
  top: ${(props) => (props.top ? props.top : 0)};
  z-index: ${(props) => (props.zIndex ? props.zIndex : 1)};
  border: ${(props) =>
    props.border ? `1px solid ${theme.colors.primary}` : 'none'};
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  padding: ${(props) => (props.compact ? 5 : 15)}px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  background-color: ${(props) =>
    props.type ? theme.colors[props.type] : theme.colors.primary};
`;

export const ButtonText = styled.Text`
  text-align: center;
  color: ${(props) => (props.color ? theme.colors[props.color] : '#000')};
`;

export const Title = styled.Text`
  font-size: 20px;
  color: ${theme.colors.dark};
  font-weight: bold;
`;

export const SubTitle = styled.Text`
  font-size: ${(props) => (props.small ? '12px' : '15px')};
  opacity: 0.7;
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
  color: ${(props) =>
    props.color ? theme.colors[props.color] : theme.colors.dark};
`;

export const Spacer = styled.View`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || 10}px;
`;

export const Input = styled.TextInput`
  background-color: ${theme.colors.light};
  border: 1px solid ${theme.colors.muted};
  width: 100%;
  padding: 7px 15px;
`;

export const Map = styled(MapView)`
  flex: 1;
  width: 100%;
  height: 100%;
  opacity: ${(props) => (props.disabled ? 0.2 : 1)};
`;

export const Avatar = styled.Image.attrs({
  elevation: 50,
})`
  width: ${(props) => (props.small ? '35px' : '50px')};
  height: ${(props) => (props.small ? '35px' : '50px')};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background: #c4c4c4;
  border-radius: ${(props) => (props.small ? '35px' : '50px')};
`;

export const VerticalSeparator = styled.View`
  width: 1px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
`;

export const Bullet = styled.View`
  width: 7px;
  height: 7px;
  border-radius: 7px;
  background-color: ${(props) => (props.destination ? '#F93A3A' : '#35E419')};
`;

export const PulseCircle = styled(Pulse).attrs({
  color: theme.colors.primary,
})``;

export const AddressList = styled.FlatList`
  flex: 1;
  width: 100%;
  padding-top: 10px;
`;

export const AddressItem = styled.TouchableOpacity`
  padding: 5px 0;
  align-items: flex-start;
`;
