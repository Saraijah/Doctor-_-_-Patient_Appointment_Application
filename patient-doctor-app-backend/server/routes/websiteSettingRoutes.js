import express from 'express';
import {updateTimeWebsiteSettingsById, getWebsiteSettingsById, deleteWebsiteSettingsById, createWebsiteSettings, getAllWebsiteSettings } from '../controllers/websiteSettingsController.js';

const websiteSettingsRouter = express.Router();
websiteSettingsRouter.route('/').get(getAllWebsiteSettings).post(createWebsiteSettings)
// adminRouter.route('/search').get(findadmin); // Define search route separately


websiteSettingsRouter.route('/:id')
  .patch(updateTimeWebsiteSettingsById)
  .delete(deleteWebsiteSettingsById)
  .get(getWebsiteSettingsById);



export default  websiteSettingsRouter;
