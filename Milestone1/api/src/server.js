const express = require('express');

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.urlencoded({extended: true}));
app.use(express.json());


const routes = require('../src/routes');
app.use('/', routes);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));