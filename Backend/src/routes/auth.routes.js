import {Router} from 'express';
import { validateLogin, validateRegisterUser } from '../validators/auth.validator.js';
import { googleCallback, login, register , } from '../controllers/auth.controllers.js';
import passport from 'passport';

const router = Router();

router.post("/register" ,validateRegisterUser, register)

router.post('/login',validateLogin, login)

router.get("/google",passport.authenticate("google" , { scope: ["profile" ,"email"]}))

router.get("/google/callback",passport.authenticate("google",{session:false, failureRedirect:"http://localhost:5173/login"}),

googleCallback)

export default router;