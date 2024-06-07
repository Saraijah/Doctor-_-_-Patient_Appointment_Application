import express from 'express';
import { updateDoctorById,  getDoctorById, createDoctor, deleteDoctorById, getAllDoctors , getDoctorAvailableById, countAllDocrors, deleteProfileImg} from '../controllers/doctorController.js';
import upload from '../../js/multerconfig.js';





const doctorRouter = express.Router();

doctorRouter.delete('/:id/photo', deleteProfileImg);


//to get the availblt times
doctorRouter.route('/drAvailableTimes/:id').get(getDoctorAvailableById)

//route to get the count of All doctors
doctorRouter.route('/countAllDoctors').get(countAllDocrors)



doctorRouter.route('/').get(getAllDoctors).post(upload.single('img'),createDoctor);
// adminRouter.route('/search').get(findadmin); // Define search route separately
doctorRouter.route('/:id')
.delete(deleteDoctorById) // Delete student by ID
.get(getDoctorById) // Get student by ID
.patch(upload.single('img'),updateDoctorById);




export default doctorRouter;
