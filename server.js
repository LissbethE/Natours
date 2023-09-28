const mongoose = require('mongoose');

const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('💣💥 UNCAUGHT EXCEPTION! 💣💥 Shutting down...');
  console.log(err.name, err.message, err);

  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

//////////////////////////////////

const port = process.env.PORT || 3000;
const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE__PASSWORD,
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('🟢 DB Connection Successful! ✅'));

//////////////////////////////////
// 3) START SERVER
const server = app.listen(port, () =>
  console.log(`App running on port ${port}...`),
);

process.on('unhandledRejection', (err) => {
  console.log('🧨💥 UNHANDLED REJECTION! 🧨💥 Shutting down...');
  console.log(err.name, err.message, err);

  server.close(() => {
    process.exit(1);
  });
});
