import io from 'socket.io-client';

const socket = () => {
  const ws = io('http://192.168.1.71:8000');
  return ws;
};

export default socket;
