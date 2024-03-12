import styled from 'styled-components/native';
import theme from '../../styles/theme.json';

export const PickerButton = styled.TouchableOpacity`
  width: 100%;
  height: 40%;
  margin-top: 2.5%;
  border-width: 3px;
  border-style: solid;
  justify-content: space-around;
  align-items: center;
  border-color: ${(props) =>
    props.active ? theme.colors.primary : theme.colors.muted50};
  background-color: ${(props) =>
    props.active ? theme.colors.primary + '80' : theme.colors.muted50};
`;
