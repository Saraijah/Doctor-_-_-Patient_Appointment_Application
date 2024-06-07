import pool from '../database/index.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getAllPayments = async (req, res, next) => {
  try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 5;
      const offset = (page - 1) * limit;

      let sqlQuery = 'SELECT * FROM stripe_payments LIMIT ?, ?';
      console.log('SQL Query:', sqlQuery); // Log SQL query
      const [payments] = await pool.query(sqlQuery, [offset, limit]);

      const totalCountQuery = 'SELECT COUNT(*) AS total FROM stripe_payments'; // Corrected query syntax
      const [totalCountRows] = await pool.query(totalCountQuery);
      const totalRecords = totalCountRows[0].total;

      const jsonResponse = {
          status: 'success',
          result: payments.length,
          totalPages: Math.ceil(totalRecords / limit),
          currentPage: page,
          data: payments,
          totalItems: totalRecords
      };

      console.log('JSON Response:', JSON.stringify(jsonResponse, null, 2)); // Log JSON response with proper formatting

      res.status(200).json({
          status: 'success',
          result: payments.length,
          totalPages: Math.ceil(totalRecords / limit),
          currentPage: page,
          data: {result:payments},
          totalItems: totalRecords // Return the jsonResponse directly instead of wrapping it in an object
      });
  } catch (err) {
      console.error(`Error retrieving payments: ${err}`); // Log the error message
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to create a payment
const createPayments = async (req, res, next) => {
  try {
    const { patient_id, appointment_id, amount, currency, description, email } = req.body;

    // Check if all required parameters are provided
    if (!patient_id || !appointment_id || !amount || !currency || !description || !email) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Create a Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Ensure the amount is in cents
      currency,
      description,
      receipt_email: email
    });

    // Save payment information to your database
    const payment = {
      patient_id,
      appointment_id,
      amount,
      currency,
      description,
      email,
      payment_intent_id: paymentIntent.id,
      payment_date: new Date(), // Assuming payment date is current date/time
      status: 'succeeded' // Assuming the payment is successful by default
    };

    // Insert payment record into the database
    const [result] = await pool.query('INSERT INTO stripe_payments SET ?', payment);

    // Handle successful payment creation
    res.status(200).json({
      status: 'success',
      message: 'Payment created successfully',
      client_secret: paymentIntent.client_secret, // Return the client secret
      payment_id: result.insertId // Provide the ID of the inserted payment record
    });
  } catch (error) {
    console.error(`Error Creating Payment: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





  //deleting schedule

  const deletePaymentById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const sqlQuery = `DELETE FROM stripe_payments schedule_table WHERE id = ?`;
      const [result] = await pool.query(sqlQuery, [id]);
      res.status(200).json({
        status: 'success',
        data: { result:result }
      });
    } catch (error) {
      console.error(`Error deleting payment: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
      throw error.message;
    }
  };


  const getPaymentById = async (req, res, next) => {
    try {
      // Extract patient ID from request parameters
      const id = req.params.id;
  
      // SQL query to select patient by ID from the database
      const sqlQuery = `SELECT * FROM stripe_payments WHERE id = ?`;
      
      // Execute the SQL query with patient ID
      const [result] = await pool.query(sqlQuery, [id]);
  
      // Check if the result is empty, indicating patient with the given ID doesn't exist
      if (!result.length) {
        return res.status(404).json({
          status: 'error',
          message: `Payment with ID ${id} not found`,
        });
      }
  
      // Send a success response with the patient data
      res.status(200).json({
        status: 'success',
        data: { result: result },
      });
    } catch (error) {
      // Handle any errors that occur during the database operation
      console.error(`Error receiving Schedule: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  const updateScheduleById = async(req, res, next) => {
    try {
      // Extract schedule ID from request parameters
      const id = req.params.id;
      
      // Extract schedule information from request body
      const { patient_id, appointment_id, amount, payment_date, status, payment_intent_id, description, email, created_at, updated_at } = req.body;
      
      // SQL query to update schedule information in the database
      const sqlQuery = `patient_id=?, appointment_id=?, amount=?, payment_date=?, status=?, payment_intent_id=?, description=?, email=?, created_at, updated_at=?  WHERE id=?`;
  
      // Execute the SQL query with schedule information
      const [result] = await pool.query(sqlQuery, [patient_id, appointment_id, amount, payment_date, status, payment_intent_id, description, email, created_at, updated_at, id]);
    
      // If no rows were affected by the update, it means the schedule with the given ID wasn't found
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: `Cannot update schedule with ID ${id}, not found`,
        });
      }
    
      // Send a success response with updated schedule information
      res.status(200).json({
        status: 'success',
        message: `Payment with ID ${id} updated successfully`,
        data: { result: result },
      });
    } catch (error) {
      // Handle any errors that occur during the database operation
      console.error(`Error updating schedule info: ${error.message}`);
      res.status(500).json({ error: `Internal server error` });
      throw error; // Rethrow the error for further handling, if necessary
    }
  };
  

export {getAllPayments, createPayments, getPaymentById, deletePaymentById } 