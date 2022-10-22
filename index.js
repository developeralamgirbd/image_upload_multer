const express = require('express');
const app = express();
require('dotenv').config();
const { readdirSync } = require('fs');
// Security middleware import
const helmet = require('helmet');
const cors = require('cors');

// Security middleware implement
app.use(helmet());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());


// Router implement
readdirSync('./src/routes').map(r => app.use('/api/v1', require(`./src/routes/${r}`)));

// Server
const port = process.env.PORT || 8000;
app.listen(port, ()=>{
    console.log('Server run successfully');
})