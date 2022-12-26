const express = require('express');
const app = express();

const PORT = 3000;

const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }
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


  app.post('/movies/create', (req, res) => {
    // TODO: Add code to handle movie creation
  });
  
  app.get('/movies/read', (req, res) => {
    res.json({status: 200, data: movies});
  });
  
  app.put('/movies/update', (req, res) => {
    // TODO: Add code to handle movie update
  });
  
  app.delete('/movies/delete', (req, res) => {
    // TODO: Add code to handle movie delete
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


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
