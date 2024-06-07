import express from 'express';
import { createPayments, getAllPayments, getPaymentById, deletePaymentById } from '../controllers/paymentController.js';


const paymentRouter = express.Router();
paymentRouter.route('/').get(getAllPayments).post(createPayments);

paymentRouter.route('/:id').get(getPaymentById).delete(deletePaymentById)



export default paymentRouter;


