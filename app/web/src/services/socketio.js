/* eslint-disable no-console */
import socket from 'socket.io-client';

let socketio;

// eslint-disable-next-line import/prefer-default-export
export const socketConnect = action => {
  socketio = socket('http://127.0.0.1:7001/packaging');

  socketio.on('connect', () => {
    console.info('socket-io connect');
    socketio.emit('packaging');
  });

  socketio.on('res', msg => {
    console.info(msg);
    action(msg);
  });
};
