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


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
