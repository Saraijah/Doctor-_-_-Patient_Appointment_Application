import express from 'express';
import {updateTimeById, getSTimeById, deleteTimeById, createTimeSlot, getAllTime, getTimeSlotByDoctorId } from '../controllers/TimeSlotController.js';

const timeSlotRouter = express.Router();
timeSlotRouter.route('/').get(getAllTime).post(createTimeSlot);

//get timeslot by doctor Id

timeSlotRouter.route('/doctorTimslot/:id').get(getTimeSlotByDoctorId)


// adminRouter.route('/search').get(findadmin); // Define search route separately
timeSlotRouter.route('/:id')
.delete(deleteTimeById) // Delete student by ID
.get(getSTimeById) // Get student by ID
.patch(updateTimeById);


export default timeSlotRouter;
