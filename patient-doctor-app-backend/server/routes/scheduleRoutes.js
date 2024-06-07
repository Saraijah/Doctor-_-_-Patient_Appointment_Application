import express from 'express';
import {updateScheduleById, getScheduleById, deleteScheduleById, createSchedule, getAllSchedule  } from '../controllers/scheduleController.js';

const scheduleRouter = express.Router();
scheduleRouter.route('/schedule').get(getAllSchedule).post(createSchedule);
// adminRouter.route('/search').get(findadmin); // Define search route separately
scheduleRouter.route('/schedule/:id')
.delete(deleteScheduleById) // Delete student by ID
.get(getScheduleById) // Get student by ID
.put(updateScheduleById);


export default scheduleRouter;
