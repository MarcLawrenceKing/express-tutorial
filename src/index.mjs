import express from 'express';

const app = express();

app.use(express.json())

const PORT = process.env.PORT || 3000;

const mockUsers = [
  {id: 1, username: "marc" ,display: "Marc"},
  {id: 2, username: "lawrence" ,display: "Lawrence"},
  {id: 3, username: "w" ,display: "w"},
]
app.get('/', (request, response) =>{
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
  const {body} = req;
  const newUser = {id:mockUsers[mockUsers.length-1].id+1, ...body};
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});

// u can have one or more params to present dynamic data
app.get('/api/users/:id', (req,res) => {
  console.log(req.params);
  const parsedId = parseInt(req.params.id)
  console.log(parsedId)
  //if id is not a number
  if (isNaN(parsedId))
    return res.status(400).send({ msg: "BAD REQUEST!"});

  //find the user inside mockUsers array
  const findUser = mockUsers.find((user) => user.id === parsedId);
  //if not found
  if (!findUser) 
    return res.sendStatus(404);
  // if found
  return res.send(findUser)
});

app.get('/api/products', (req,res) => {
  res.send([
    {id: 123, name: "sugar", price: 10}
  ])
});

app.put('/api/users/:id', (req, res) => {
  const {body, params: {id},} = req;
  const parsedId = parseInt(id);
  if(isNaN(parsedId)) 
    return res.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1)
    return res.sendStatus(404);

  mockUsers[findUserIndex] = {id: parsedId, ...body};
  return res.sendStatus(200);
});
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})