import express from 'express'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRouter from '../src/routes/auth.routes.js'


const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.use("/api/auth" , authRouter)

export default app;