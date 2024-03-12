const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/driverx?replicaSet=rs';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose
  .connect(URI)
  .then(() => console.log('DB is Up!'))
  .catch((err) => console.log(err));
