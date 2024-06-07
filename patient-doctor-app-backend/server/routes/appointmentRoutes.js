import express from 'express';
import {updateAppointmentById , deleteAppointmentById, getAppointmentById, createAppointment,  getAllAppointments,getCountOfAppointmentsForToday, countAllAppointments } from '../controllers/appoimentController.js';


const appointmentRouter = express.Router();


// Routes for handling appointments
appointmentRouter.route('/')
  .get(getAllAppointments)
  .post(createAppointment);

// Route for getting current day's appointments
appointmentRouter.route('/today')
  .get(getCountOfAppointmentsForToday );

// Route for getting the total count of appointments
appointmentRouter.route('/totalAppointments')
  .get(countAllAppointments);

// Routes for handling a specific appointment by ID
appointmentRouter.route('/:id')
  .get(getAppointmentById)
  .put(updateAppointmentById)
  .delete(deleteAppointmentById);

export default appointmentRouter;
