const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

//////////////////////////////////

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE__PASSWORD,
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAnModify: false,
  })
  .then(() => console.log('😼 DB Connection Successful!'));

//////////////////////////////////
// Read Json File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

// Import Data  Into DB
const importData = async function () {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);

    console.log('Data Successfully Loaded!');
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

// Delete All Data From DB
const deleteData = async function () {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log('Data Successfully Delete!');
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();
