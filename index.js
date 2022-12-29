const express = require('express');
const app = express();

const PORT = 3000;

const movies = [
    {id : 1, title: 'Jaws', year: 1975, rating: 8 },
    {id : 2, title: 'Avatar', year: 2009, rating: 7.8 },
    {id : 3, title: 'Brazil', year: 1985, rating: 8 },
    {id : 4, title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }
]

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

 
  
  app.get('/movies/add', (req, res) => {
    const title = req.query.title;
    const year = req.query.year;
    const rating = req.query.rating || 4; // default rating if not provided
  
    if (!title || !year || year.length !== 4 ||  isNaN(year)) {
      res.status(403).json({status: 403, error: true, message: "you cannot create a movie without providing a title and a year"});
      return;
    }
  
    const newMovie = {title, year, rating};
    movies.push(newMovie);
    res.json({status: 200, data: movies});
  });
  

  app.get('/movies/delete/:id', (req, res) => {
    const id = req.params.id;
    const movieIndex = movies.findIndex(movie => movie.id == id);
    if (movieIndex !== -1) {
      movies.splice(movieIndex, 1);
      res.json({status: 200, data: movies});
    } else {
      res.status(404).json({status: 404, error: true, message: `the movie ${id} does not exist`});
    }
  });


  app.get('/movies/update/:id', (req, res) => {
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
  

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
