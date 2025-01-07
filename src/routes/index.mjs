import { Router } from "express";
import usersRouter from "./users.mjs"
import productssRouter from "./products.mjs"

const router = Router();
router.use(usersRouter);
router.use(productssRouter);


export default router;