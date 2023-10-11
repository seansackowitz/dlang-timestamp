const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// app.get('/', (req,  res) => {
//   res.json({your_api: 'it works'});
// });

const routes = require('../src/routes');
app.use('/', routes);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));