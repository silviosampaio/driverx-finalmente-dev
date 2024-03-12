import produce from 'immer';
import types from './types';

const INITIAL_STATE = {
  user: {
    fbId: null,
    nome: null,
    email: null,
    tipo: 'M',
    accessToken: null,
  },
  paymentMethod: {
    numero: null,
    nome: null,
    validade: null,
    cvv: null,
    cpf: null,
  },
  car: {placa: null, marca: null, modelo: null, cor: null},
  ride: null,
};

function shop(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_USER: {
      return produce(state, (draft) => {
        draft.user = {...state.user, ...action.user};
      });
    }
    case types.UPDATE_PAYMENT_METHOD: {
      return produce(state, (draft) => {
        draft.paymentMethod = action.payment;
      });
    }
    case types.UPDATE_CAR: {
      return produce(state, (draft) => {
        draft.car = action.car;
      });
    }
    case types.UPDATE_RIDE: {
      return produce(state, (draft) => {
        draft.ride = action.ride;
      });
    }
    default:
      return state;
  }
}

export default shop;
