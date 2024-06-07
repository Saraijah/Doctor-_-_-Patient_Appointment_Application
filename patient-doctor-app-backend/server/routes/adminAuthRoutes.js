import express from 'express';
import {loginUser} from '../controllers/adminController.js';

const authAdminRouter = express.Router();

// Define the authentication route for patients
authAdminRouter.post('/', loginUser);

export default authAdminRouter;


