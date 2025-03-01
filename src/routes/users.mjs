import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import {mockUsers} from "../utils/constants.mjs"
import { createUserValidationSchema } from "../utils/validationSchema.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

router.get('/api/users', 
  query('filter')
  .isString()
  .notEmpty()
  .withMessage('must not be empty!')
  .isLength({min: 3, max:10})
  .withMessage('must be between 3 to 30 characters!'), (req, res) => {

  console.log(req.session.id); //test session id
  // we can pass any session id in sessionStore and get the data
  req.sessionStore.get(req.session.id, (err, sessionData) => {
    if (err){
      console.log(err);
      throw err;
    }
    console.log("Inside session store get")
    console.log(sessionData)
  })
  const result = validationResult(req);
  console.log(result)
  // destructure 
  const { query: {filter,value},} = req;
    
  if(filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)))

  return res.send(mockUsers);
  
}) ;// /api prefix is good practice

router.post('/api/users', checkSchema(createUserValidationSchema), async (req,res) => {
  const result = validationResult(req)
  // if result is not empty, send error
  if(!result.isEmpty()) return res.status(400).send(result.array());

  const data = matchedData(req);
  console.log(data)
  data.password = hashPassword(data.password)
  console.log(data)

  const newUser = new User(data);
  try {
    const savedUser = await newUser.save();
    return res.status(201).send(savedUser)
  } catch (err) {
    console.log(err);
    return response.sendStatus(400);
  }
  
});

router.get('/api/users/:id', resolveIndexByUserId, (req,res) => {
  const {findUserIndex} = req;
  const findUser = mockUsers[findUserIndex];
  //if not found
  if (!findUser) 
    return res.sendStatus(404);
  // if found
  return res.send(findUser)
});


router.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
  const {body, findUserIndex} = req; // findUserIndex is from middleware, body is from thunderclient
  
  mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body}; //update all values of index number found except id 
  return res.sendStatus(200);
});

router.patch('/api/users/:id',resolveIndexByUserId, (req, res) => {
  const {body, findUserIndex} = req; //destrucure req
  
  // take the existing values THEN add/override the new values 
  mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body}
  return res.sendStatus(200);
})

//req body is not really necessary in DELETE
router.delete('/api/users/:id', (req, res) => { 
  const { params: {id}} = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId))
    return res.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1)
    return res.sendStatus(404);   
  mockUsers.splice(findUserIndex);
  return res.sendStatus(200);
})


export default router;