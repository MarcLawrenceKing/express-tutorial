import express from 'express';
import routes from "./routes/index.mjs"
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUsers } from './utils/constants.mjs';
import passport from 'passport';
import mongoose from 'mongoose';
import './strategies/local-strategy.mjs'
import MongoStore from 'connect-mongo';

const app = express();

mongoose.connect('mongodb://localhost:27017/express_tutorial')
.then(() => console.log("Connected"))
.catch((err) => console.log(`Error: ${err}`))

app.use(express.json())
app.use(cookieParser("helloworld"))
app.use(session({
  secret: 'marc',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * 60,
  },
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
  })
}))

app.use(passport.initialize());
app.use(passport.session())

app.use(routes);

app.get('/', (req, res) => {
  console.log('hi');
  res.send("Hello world!!");
  
});

app.post('/api/auth', passport.authenticate("local"), (req, res) => {
  res.sendStatus(200)
});

app.get('/api/auth/status',(req, res) => {
  console.log('Inside /auth/status')
  console.log(req.user)
  console.log(req.session)
  console.log(req.sessionID)
  return req.user? res.send(req.user) : res.sendStatus(401);
});

const PORT = process.env.PORT || 3000;

// u can have one or more params to present dynamic da
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})