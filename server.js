// IMPORT MODULES
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//!LISTENER FOR UNCAUGHT EXCEPTIONS
// Safety net in case exceptions are not caught explicitly
process.on('uncaughtException', (err) => {
  console.log(err);
  console.log(err.name, err.message);
  console.log('UNHANDLED EXCEPTION! Shutting Down...');
  process.exit(1);
});

// SET CONFIGURATION PATH
dotenv.config({ path: './config.env' });
const app = require('./app');

// CONNECT TO CLOUD SERVER CLUSTER
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// INIT MONGOOSE CONNECTION TO THE DATABASE
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connection successful...');
  })
  .catch((error) => {
    console.log('Database connection failed...', error);
  });

// START SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//!LISTENER FOR UNHANDLED REJECTIONS
// Safety net in case promise rejections are not caught explicitly
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting Down...');
  server.close(() => {
    process.exit(1);
  });
});

//!LISTENER FOR SIGTERM SIGNAL
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED! Shutting Down');
  server.close(() => {
    console.log('PROCESS TERMINATED!');
    //Sigterm shuts down the program here
  });
});
