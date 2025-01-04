import express from 'express';

const app = express();

app.use(express.json())

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

//app.use(loggingMiddleware);

const resolveIndexByUserId = (req, res, next) => {
  const { params: {id}} = req; //destrucure req
  const parsedId = parseInt(id); 
  if(isNaN(parsedId)) 
    return res.sendStatus(400); //send bad request if id is NaN
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId); 
  if (findUserIndex === -1) // -1 is the value if user is not existing
    return res.sendStatus(404);
  req.findUserIndex = findUserIndex; //pass the value of findUserIndex to next function
  next();
}

const PORT = process.env.PORT || 3000;

const mockUsers = [
  {id: 1, username: "marc" ,display: "Marc"},
  {id: 2, username: "lawrence" ,display: "Lawrence"},
  {id: 3, username: "w" ,display: "w"},
]
app.get('/', loggingMiddleware, (request, response) =>{
  response.status(201).send({msg:"Hello World!"});
}); //routes and request handler, request object and response object 

app.get('/api/users', (req, res) => {
  console.log(req.query) //gets all queries
  // example finding substring 'ma'
  // http://localhost:3000/api/users?filter=username&value=ma

  // destructure 
  const { query: {filter,value},} = req;
    
  if(filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)))

  return res.send(mockUsers);
  
}) // /api prefix is good practice

app.post('/api/users', (req,res)=> {
  const {body} = req; // destructure req to use the values
  const newUser = {id:mockUsers[mockUsers.length-1].id+1, ...body};
  mockUsers.push(newUser); // add new user to array
  return res.status(201).send(newUser);
});

// u can have one or more params to present dynamic data
app.get('/api/users/:id', resolveIndexByUserId, (req,res) => {
  const {findUserIndex} = req;
  const findUser = mockUsers[findUserIndex];
  //if not found
  if (!findUser) 
    return res.sendStatus(404);
  // if found
  return res.send(findUser)
});


app.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
  const {body, findUserIndex} = req; // findUserIndex is from middleware, body is from thunderclient
  
  mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body}; //update all values of index number found except id 
  return res.sendStatus(200);
});

app.patch('/api/users/:id',resolveIndexByUserId, (req, res) => {
  const {body, findUserIndex} = req; //destrucure req
  
  // take the existing values THEN add/override the new values 
  mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body}
  return res.sendStatus(200);
})

//req body is not really necessary in DELETE
app.delete('/api/users/:id', (req, res) => { 
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
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})