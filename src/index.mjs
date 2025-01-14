import express from 'express';
import routes from "./routes/index.mjs"
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUsers } from './utils/constants.mjs';

const app = express();

app.use(express.json())
app.use(cookieParser("helloworld"))
app.use(session({
  secret: 'marc',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * 60,
  }
}))
app.use(routes);

const PORT = process.env.PORT || 3000;

// u can have one or more params to present dynamic da
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);

  //if the session cookie is not expired, do not create a new one; use to track user
  req.session.visited = true;
  res.cookie('hello', 'world', {maxAge: 60000 * 60 * 2, signed: true});
  res.status(201).send({msg: 'hello!' })
})

app.post('/api/auth', (req, res) => {
  const {body: { username,password }} = req;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password != password)
    return res.status(200).send({msg: "BAD CREDENTIALS"});

  req.session.user = findUser;
  return res.status(200).send(findUser);
});

app.get('/api/auth/status', (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
  })
  return req.session.user
  ? res.status(200).send(req.session.user)
  : res.status(401).send({msg: 'not authenticated!'});
  
} ) 

app.post('/api/cart', (req, res) => {
  if(!req.session.user) return res.sendStatus(401);

  const {body:item} = req;
  const {cart} = req.session;

  if(cart){
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(201).send(item);
})

app.get('/api/cart', (req, res) => {
  if(!req.session.user) return res.sendStatus(401);
  return res.send(req.session.cart ?? [])
})