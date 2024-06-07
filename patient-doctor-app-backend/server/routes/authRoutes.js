import express from 'express';
import { loginUser } from '../controllers/patientController.js';

const authPatientRouter = express.Router();

// Define the authentication route for patients
authPatientRouter.post('/', loginUser);

export default authPatientRouter;
