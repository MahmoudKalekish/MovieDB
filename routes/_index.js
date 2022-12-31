// const noteRoutes = require('./note_routes');

// module.exports = function(app, db) {  noteRoutes(app, db); 
//      // Other route groups could go here, in the future
    
//     };

const express =require('express');

const router =express.Router();

// router.get('/', (req, res)=>{
//      res.send('We are VENOM!!!');
// })
router.post('/', (req, res)=>{
     console.log(req.body);;
})



module.exports=router;