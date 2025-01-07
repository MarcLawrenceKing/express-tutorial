import express from 'express';
import routes from "./routes/index.mjs"

const app = express();

app.use(express.json())

app.use(routes);

const PORT = process.env.PORT || 3000;

// u can have one or more params to present dynamic da
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})