const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
//for mongoose connection
require('dotenv/config'); 
//for .env file
const { Schema } = mongoose;

const users = [
  { id: 1, username: 'john', password: 'password123' },
  { id: 2, username: 'jane', password: 'pass123' },
];

mongoose.set("strictQuery", true);
//to remove the warning

app.use(bodyParser.json());
//our response comes back from postman

const PORT = 3000;


const movieSchema = new Schema(
  {
      title: {
          type: String,
          required: true,
      },
      year: {
          type: Number,
          required: true,
          min: 1900,
          max: 2100,
      },
      rating: {
          type: Number,
          default: 4,
          min: 0,
          max: 10,
      },
  },
  { versionKey: false }
);

const movies = [
    {id : 1, title: 'Jaws', year: 1975, rating: 8 },
    {id : 2, title: 'Avatar', year: 2009, rating: 7.8 },
    {id : 3, title: 'Brazil', year: 1985, rating: 8 },
    {id : 4, title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }
]

app.get('/test', (req, res) => {
  res.json({status: 200, message: 'ok'});
});

app.get('/time', (req, res) => {
  const currentTime = new Date().toLocaleTimeString();
  res.json({status: 200, message: currentTime});
});

app.get('/hello/:id', (req, res) => {
  const id = req.params.id;
//   http://localhost:3000/hello/123
  res.json({status: 200, message: `Hello, ${id || 'world'}`});
});

app.get('/hello', (req, res) => {
  res.json({status: 200, message: 'Hello, world'});
});

app.get('/search', (req, res) => {
    const search = req.query.s;
    //http://localhost:3000/search?s=cats
    if (search) {
      res.status(200).json({status: 200, message: 'ok', data: search});
    } else {
      res.status(500).json({status: 500, error: true, message: 'you have to provide a search'});
    }
  });


  
  app.get('/movies/read', (req, res) => {
    res.json({status: 200, data: movies});
  });
  



  app.get('/movies/read/by-date', (req, res) => {
    const moviesByDate = movies.sort((a, b) => a.year - b.year);
    res.json({status: 200, data: moviesByDate});
  });
  // the sort method and providing a comparison function that compares the year property of movie a to the year property of movie b. If the year of movie a is less than the year of movie b, the comparison function returns a negative value, causing movie a to be placed before movie b in the sorted array. 
  
  app.get('/movies/read/by-rating', (req, res) => {
    const moviesByRating = movies.sort((a, b) => b.rating - a.rating);
    res.json({status: 200, data: moviesByRating});
  });

  //the rating property of movie a to the rating property of movie b. If the rating of movie a is less than the rating of movie b, the comparison function returns a negative value, causing movie a to be placed after movie b in the sorted array. If the rating of movie a is greater than the rating of movie b, the comparison function returns a positive value, causing movie a to be placed before movie b in the sorted array. 
  
  app.get('/movies/read/by-title', (req, res) => {
    const moviesByTitle = movies.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
    res.json({status: 200, data: moviesByTitle});
  });

  //the sort method uses an if-else statement to compare the title properties of movie a and movie b. 
//   If the title of movie a is lexicographically less than the title of movie b (i.e., it comes before it in the alphabet), the comparison function returns -1, causing movie a to be placed before movie b in the sorted array. If the title of movie a is lexicographically greater than the title of movie b, the comparison function returns 1, causing movie a to be placed after movie b in the sorted array.
//    If the title of movie a and movie b are equal, the comparison function returns 0, causing the order of movie a and movie b to remain unchanged in the sorted array.

app.get('/movies/read/id/:id', (req, res) => {
    const id = req.params.id;
    const movie = movies.find(movie => movie.id == id);
    if (movie) {
      res.json({status: 200, data: movie});
    } else {
      res.status(404).json({status: 404, error: true, message: `the movie ${id} does not exist`});
    }
  });

 
  
  
  app.post('/movies/add', (req, res) => {
    const title = req.query.title;
    const year = req.query.year;
    const rating = req.query.rating || 4; // default rating if not provided
  //http://localhost:3000/movies/add?title=batman&year=2022&rating=8
    if (!title || !year || year.length !== 4 ||  isNaN(year)) {
      res.status(403).json({status: 403, error: true, message: "you cannot create a movie without providing a title and a year"});
      return;
    }
  
    const newMovie = {title, year, rating};
    movies.push(newMovie);
    res.json({status: 200, data: movies});
  });
  

  app.delete('/movies/delete/:id', (req, res) => {
    const id = req.params.id;
    const movieIndex = movies.findIndex(movie => movie.id == id);
    if (movieIndex !== -1) {
      movies.splice(movieIndex, 1);
      res.json({status: 200, data: movies});
    } else {
      res.status(404).json({status: 404, error: true, message: `the movie ${id} does not exist`});
    }
  });


  app.put('/movies/update/:id', (req, res) => {
    const id = req.params.id;
    const movie = movies.find(movie => movie.id == id);
    if (movie) {
      const { title, rating } = req.query;
      // Query parameters are a way to pass additional information in the form of key-value pairs in the URL of an HTTP request. They are appended to the URL after a question mark (?) and are separated by an ampersand (&).
      if (title) movie.title = title;
      if (rating) movie.rating = rating;
      res.json({status: 200, data: movies});
    } else {
      res.status(404).json({status: 404, error: true, message: `the movie ${id} does not exist`});
    }
  });


  // mongoose.connect(
  //   process.env.DB_CONNECTION,
  // {useNewUrlParser: true},
  // () => console.log('connnectttttt'));
  

  mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
      console.log("Successfully connected to database");
  })
  .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
  });

  // const client = new MongoClient(process.env.DB_CONNECTION, { useNewUrlParser: true });
  // client.connect(err => {
  //   const collection = client.db("test").collection("devices");
  //   // perform actions on the collection object
  //   client.close();
  // });





const Movie = mongoose.model('Movie', movieSchema);


// Use the save method to store data in the database
// const movie = new Movie({ title: 'Jaws', year: 1975, rating: 8 });
app.post('/movies', async function (req, res) {
  let { title, year, rating = 4 } = req.body;
  if (year) year = parseInt(year);

  let bodyOkay = title && year && year.toString().length === 4 && typeof year === "number";
  if (!bodyOkay) return res.status(403).json({
      status: 403,
      error: true,
      message: 'you cannot create a movie without providing a title and a year'
  });

  await collection.insert({ title, year, rating });
  let movies = await collection.find({}).toArray();

  res.send({ status: 200, data: movies });
});


// app.get('/moviess', async (req, res) => {
//   try {
//     const movies = await movieModel.find();
//     res.json({status: 200, data: movies});
//   } catch (error) {
//     res.status(500).json({status: 500, error: true, message: error.message});
//   }
// });

app.patch('/movies/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const movie = await movieModel.findById(id);
    if (movie) {
      const { title, year, rating } = req.body;
      if (title) movie.title = title;
      if (year) movie.year = year;
      if (rating) movie.rating = rating;
      const result = await movie.save();
      res.json({status: 200, data: result});
    } else {
      res.status(404).json({status: 404, error: true, message: `the movie ${id} does not exist`});
    }
  } catch (error) {
    res.status(500).json({status: 500, error: true, message: error.message});
  }
});


//Delete movie by id
app.delete('/movies/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Movie.findByIdAndDelete(id);
    if (result) {
      res.json({status: 200, data: result});
    } else {
      res.status(404).json({status: 404, error: true, message: `the movie ${id} does not exist`});
    }
  } catch (error) {
    res.status(500).json({status: 500, error: true, message: error.message});
  }
});





//To retrieve data from the database
Movie.find((error, movies) => {
  if (error) {
    console.log(error);
  } else {
    console.log(movies);
  }
});


//use the findOne method to retrieve a single document from the database
Movie.findOne({ title: 'Jaws' }, (error, movie) => {
  if (error) {
    console.log(error);
  } else {
    console.log(movie);
  }
});

// STEPPPPPPPPPPP 13::::::::::


app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    // Check if the username is already taken
    const existingUser = users.find(user => user.username === username);
    if (!existingUser) {
      // If the username is not taken, create a new user
      const user = {
        id: users.length + 1,
        username,
        password
      };
      users.push(user);
      res.json({status: 200, data: { username }});
    } else {
      // If the username is taken, return an error
      res.status(403).json({status: 403, error: true, message: 'The username is already taken'});
    }
  } else {
    res.status(400).json({status: 400, error: true, message: 'You must provide a username and a password'});
  }
});


app.post('/signin', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    // Check if the username and password match a user in the users array
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
      // If the username and password are correct, generate a JWT
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      // Send the JWT to the client
      res.json({status: 200, data: { token }});
    } else {
      // If the username and password are incorrect, return an error
      res.status(401).json({status: 401, error: true, message: 'The username or password is incorrect'});
    }
  } else {
    res.status(400).json({status: 400, error: true, message: 'You must provide a username and a password'});
  }
});



app.patch('/movies/:id', (req, res) => {
  // Get the JWT from the authorization header
  const authorization = req.headers.authorization;
  if (authorization) {
    // Split the authorization header to get the JWT
    const token = authorization.split(' ')[1];
    // Verify the JWT
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        // If the JWT is invalid, return an error
        res.status(401).json({status: 401, error: true, message: 'Unauthorized'});
      } else {
        // If the JWT is valid, update the movie
        const id = req.params.id;
        const movie = movies.find(movie => movie.id == id);
        if (movie) {
          const { title, rating } = req.body;
          if (title) movie.title = title;
          if (rating) movie.rating = rating;
          res.json({status: 200, data: movies});
        } else {
          res.status(404).json({status: 404, error: true, message: `the movie ${id} does not exist`});
        }
      }
    });
  } else {
    res.status(401).json({status: 401, error: true, message: 'Unauthorized'});
  }
});


app.post('/movies', (req, res) => {
  // Get the JWT from the authorization header
  const authorization = req.headers.authorization;
  if (authorization) {
    // Split the authorization header to get the JWT
    const token = authorization.split(' ')[1];
    // Verify the JWT
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        // If the JWT is invalid, return an error
        res.status(401).json({status: 401, error: true, message: 'Unauthorized'});
      } else {
        // If the JWT is valid, create a new movie
        const { title, year, rating } = req.body;
        if (title && year) {
          // Validate the year
          if (year.length === 4 && !isNaN(year)) {
            // If the year is valid, create the movie
            const movie = {
              id: movies.length + 1,
              title,
              year,
              rating: rating || 4
            };
            movies.push(movie);
            res.json({status: 200, data: movies});
          } else {
            // If the year is invalid, return an error
            res.status(400).json({status: 400, error: true, message: 'You must provide a valid year'});
          }
        } else {
          // If the title or year is missing, return an error
          res.status(400).json({status: 400, error: true, message: 'You must provide a title and a year'});
        }
      }
    });
  } else {
    res.status(401).json({status: 401, error: true, message: 'Unauthorized'});
  }
});


app.delete('/movies/:id', (req, res) => {
  // Get the JWT from the authorization header
  const authorization = req.headers.authorization;
  if (authorization) {
    // Split the authorization header to get the JWT
    const token = authorization.split(' ')[1];
    // Verify the JWT
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        // If the JWT is invalid, return an error
        res.status(401).json({status: 401, error: true, message: 'Unauthorized'});
      } else {
        // If the JWT is valid, delete the movie
        const id = req.params.id;
        const movieIndex = movies.findIndex(movie => movie.id == id);
        if (movieIndex !== -1) {
          movies.splice(movieIndex, 1);
          res.json({status: 200, data: movies});
        } else {
          res.status(404).json({status: 404, error: true, message: `the movie ${id} does not exist`});
        }
      }
    });
  } else {
    res.status(401).json({status: 401, error: true, message: 'Unauthorized'});
  }
});




app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

