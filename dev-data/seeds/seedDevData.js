// IMPORT MODULES
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('../../models/MovieModel');

// SET CONFIGURATION PATH
dotenv.config({
  path: '/Users/ayers/Desktop/Sprints/hrr46-movie-list/backend/config.env',
});

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
    //console.log('Database connection successful...');
  });

//READ JSON file
const movies = JSON.parse(
  fs.readFileSync(`${__dirname}/movieSeed.json`, 'utf-8')
);

//Import data to database
const importData = async () => {
  try {
    await Movie.create(movies);
    console.log('Data uploaded!');
  } catch (error) {
    console.log(error);
  }
};

//Delete all data from collection
const deleteData = async () => {
  try {
    await Movie.deleteMany();
    console.log('Data deleted!');
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
