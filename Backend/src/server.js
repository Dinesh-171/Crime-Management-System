import express from 'express';
import cors from 'cors';
import {connectDB}  from './db/index.js';
import dotenv from 'dotenv';
import { Reg_route } from '../Routes/Reg.route.js';

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json())

//For Starting the Db server 
connectDB()

//Passing the parameter to the Routes 

Reg_route(app)

app.listen(process.env.PORT,()=>{
console.log(`Server is running on http://localhost:${process.env.PORT} `);

})