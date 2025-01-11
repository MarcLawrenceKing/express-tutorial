import express from 'express';
import routes from "./routes/index.mjs"
import cookieParser from 'cookie-parser';
import session from 'express-session';

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