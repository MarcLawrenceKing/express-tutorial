import express from 'express';
import { query, validationResult, body, matchedData , checkSchema, check} from 'express-validator';
import {createUserValidationSchema} from './utils/validationSchema.mjs'
import usersRouter from "./routes/users.mjs"
import {mockUsers} from "./utils/constants.mjs"
import { resolveIndexByUserId } from './utils/middlewares.mjs';

const app = express();
app.use(usersRouter)

app.use(express.json())


const PORT = process.env.PORT || 3000;

app.get('/', loggingMiddleware, (request, response) =>{
  response.status(201).send({msg:"Hello World!"});
}); //routes and request handler, request object and response object 


// u can have one or more params to present dynamic da
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})