import express from 'express';
import { getAllAdmins , addNewAdmin,deleteadmin, UpdateAdmin, getAdminById, deleteAdminImg  } from '../controllers/adminController.js';
import upload from '../../js/multerconfig.js';

const adminRouter = express.Router();




adminRouter.route('/')
  .get(getAllAdmins)
  .post(upload.single('img'), addNewAdmin);



//delete proflr image 

//delete img alone in table
adminRouter.delete('/:id/photo', deleteAdminImg);

// Define routes for a specific admin by ID
adminRouter.route('/:id')
  .get(getAdminById)
  .delete(deleteadmin)
  .patch(upload.single('img'), UpdateAdmin); 



export default adminRouter
