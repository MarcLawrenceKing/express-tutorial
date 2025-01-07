import { Router } from "express";

const router = Router()

router.get('/api/producs', (request, response) =>{
  response.send({msg:"Hello World!"});
}); //routes and request handler, request object and response object 

export default router;