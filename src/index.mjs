import express from 'express';
import routes from "./routes/index.mjs"
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json())
app.use(cookieParser("helloworld"))
app.use(routes);

const PORT = process.env.PORT || 3000;

// u can have one or more params to present dynamic da
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})

app.get("/", (req, res) => {
  res.cookie('hello', 'world', {maxAge: 60000 * 60 * 2, signed: true});
  res.status(201).send({msg: 'hello!' })
})