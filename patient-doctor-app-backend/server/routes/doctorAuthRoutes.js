import express from 'express';
import { loginUser } from '../controllers/doctorController.js';

const authDoctorRouter = express.Router();

// Define the authentication route for patients
authDoctorRouter.post('/', loginUser);

export default authDoctorRouter;
