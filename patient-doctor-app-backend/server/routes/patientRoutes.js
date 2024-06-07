import express from 'express';
import multer from 'multer'; // Import multer
import { getAllPatients, registerPatient, deletePatient, getPatientById, updatePatientById, getPatientAppointmentsById, searchPatientAppointments, deleteProfileImg,  uploadPatientPhoto, countAllPatients } from '../controllers/patientController.js';
import upload from '../../js/multerconfig.js';
import dotenv from 'dotenv';
dotenv.config();

const patientRouter = express.Router();

// Route for handling patient registration
patientRouter.post('/', upload.single('img'), registerPatient);

//route to handle patients appoinments
patientRouter.get('/appointments/:id', getPatientAppointmentsById)

//route to serch patient appointments 
patientRouter.get('/:id/appointments/search' ,searchPatientAppointments)

//delete img alone in table
patientRouter.delete('/:id/photo', deleteProfileImg);

//uploadPhoto
patientRouter.post('/:id/photo',  upload.single('img'),uploadPatientPhoto);

//counting All patients
patientRouter.get('/countAllPatients', countAllPatients);

// Routes for other operations
patientRouter.get('/', getAllPatients);
patientRouter.delete('/:id', deletePatient);
patientRouter.get('/:id', getPatientById);
patientRouter.patch('/:id', upload.single('img'), updatePatientById);   

export default patientRouter;
