const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

//////////////////////////////////

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE__PASSWORD,
);

/*
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('🟢 DB Connection Successful! ✅'))
  .catch((err) => console.log(err));*/

const dbConnect = async function () {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose
      .connect(db, options)
      .then(() => console.log('🟢 DB Connection Successful! ✅'));
  } catch (err) {
    mongoose.connection.on('error', (error) =>
      console.log(`💥Error while connecting to db: ${error}💥`),
    );

    mongoose.connection.on('disconnected', () =>
      console.log(`💣MongoDB Connection Disconnected💣`),
    );

    console.log(`💥Error: ${err}`);
  }
};

dbConnect();

//////////////////////////////////
// 3) START SERVER
const port = process.env.PORT || 8080;

const server = app.listen(port, () =>
  console.log(`App running on port ${port}...`),
);

//////////////////////////////////
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
