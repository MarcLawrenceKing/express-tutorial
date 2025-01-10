import { Router } from "express";

const router = Router()

router.get('/api/products', (req, res) =>{
  console.log(req.headers.cookie)
  console.log(req.cookies);
  console.log(req.signedCookies.hello);

  if(req.signedCookies.hello && req.signedCookies.hello === 'world')
    return res.send({msg:"Hello World!"});
  return res.send({msg:"you dont have the correct cookie"})
  
}); // routes and request handler, request object and response object 
// dsdsas

export default router;