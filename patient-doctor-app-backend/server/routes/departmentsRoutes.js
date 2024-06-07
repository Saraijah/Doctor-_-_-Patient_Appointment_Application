import express from 'express';
import {
  UpdateDepartmentById,
  deleteDepartmentById,
  getDepartmentById,
  createDepartment,
  getAllDepartments,
  getDoctorByDepartments,
  searchDoctorByDepartment,
  countAllDepartments
  
  // Import the search function
} from '../controllers/departmentController.js';

const departmentRouter = express.Router();

//route to get the count of departmebts

departmentRouter.route('/countAllDepartments').get(countAllDepartments)



departmentRouter.route('/')
  .get(getAllDepartments)
  .post(createDepartment);

departmentRouter.route('/:id')
  .delete(deleteDepartmentById) // Delete department by ID
  .get(getDepartmentById) // Get department by ID
  .put(UpdateDepartmentById);

// Route to get doctors by department ID
departmentRouter.route('/:departmentId/doctors')
  .get(getDoctorByDepartments);

// Route to search for doctors by department and name
departmentRouter.route('/:departmentId/doctors/search')
  .post(searchDoctorByDepartment);

export default departmentRouter;
