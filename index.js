const express = require('express');
const bodyParser = require('body-parser');
const server = require('./server');
const app = express();

const port = 4000;

app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello World!'));
const apolloMiddleware = server.getMiddleware();
app.use(
  (req,res,next) => {
    console.log('before');
    next();
  },
  apolloMiddleware,
  (req,res,next) => {
    console.log('This middleware will never be executed, as apollo middleware have end the request');
    next();
  },
  (err, req,res,next) => {
    console.log('Error')
    next();
  },
);
app.listen(
  port,
  () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  }
);