const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');

const database = require('./database');
const socket = require('./src/controllers/socket');

app.use(morgan('dev'));
app.use(express.json());
app.set('port', process.env.PORT || 8000);

app.use('/', require('./src/routes/api.routes'));

const server = http.createServer(app);
const io = require('socket.io')(server);
socket(io);
app.io = io;

server.listen(app.get('port'), () =>
  console.log('Server is UP on port -> ' + app.get('port'))
);
