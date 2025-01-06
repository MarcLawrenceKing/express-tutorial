import { mockUsers } from "./constants.mjs";

export const resolveIndexByUserId = (req, res, next) => {
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