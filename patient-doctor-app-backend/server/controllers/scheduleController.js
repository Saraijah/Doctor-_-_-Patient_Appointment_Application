import pool from '../database/index.js';

const getAllSchedule = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 5;
      const offset = (page - 1) * limit;
  
      let sqlQuery = 'SELECT * FROM schedule_table LIMIT ?, ?';
      console.log('SQL Query:', sqlQuery); // Log SQL query
      const [schedule] = await pool.query(sqlQuery, [offset, limit]);
      
      const totalCountQuery = 'SELECT COUNT(*) AS total FROM schedule_table';
      const [totalCountRows] = await pool.query(totalCountQuery);
      const totalRecords = totalCountRows[0].total;
  
      const jsonResponse = {
        status: 'success',
        result: schedule.length,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        data: schedule,
        totalItems: totalRecords
      };

      
  
      console.log('JSON Response:', JSON.stringify(jsonResponse, null, 2)); // Log JSON response with proper formatting

      res.status(200).json({
        status: 'success',
        data: { result:schedule }
      });
    } catch (err) {
      console.error(`Error retrieving schedule: ${err}`); // Log the error message
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  const createSchedule = async (req, res, next) => {
    try {
      const {doctor_id, day_of_week, start_time, end_time } = req.body;
      
      // Query statement to create schedule
      const sqlQuery = `
        INSERT INTO schedule_table( doctor_id, day_of_week, start_time, end_time)
        VALUES (?, ?, ?, ?)
      `;
  
      const result = await pool.query(sqlQuery, [doctor_id, day_of_week, start_time, end_time]);
  
      res.status(200).json({
        status: 'success',
        message: 'Schedule added successfully',
        data: result
      });
    } catch (error) {
      console.error(`Error Creating Schedule: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
      throw error;
    }
  };
  

  //deleting schedule

  const deleteScheduleById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const sqlQuery = `DELETE FROM  schedule_table WHERE id = ?`;
      const [result] = await pool.query(sqlQuery, [id]);
      res.status(200).json({
        status: 'success',
        data: { result:result }
      });
    } catch (error) {
      console.error(`Error deleting patient: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
      throw error.message;
    }
  };


  const getScheduleById = async (req, res, next) => {
    try {
      // Extract patient ID from request parameters
      const id = req.params.id;
  
      // SQL query to select patient by ID from the database
      const sqlQuery = `SELECT * FROM schedule_table WHERE id = ?`;
      
      // Execute the SQL query with patient ID
      const [result] = await pool.query(sqlQuery, [id]);
  
      // Check if the result is empty, indicating patient with the given ID doesn't exist
      if (!result.length) {
        return res.status(404).json({
          status: 'error',
          message: `Schedule with ID ${id} not found`,
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
      throw error.message; // Rethrow the error for further handling, if necessary
    }
  };
  
  

  const updateScheduleById = async(req, res, next) => {
    try {
      // Extract schedule ID from request parameters
      const id = req.params.id;
      
      // Extract schedule information from request body
      const { doctor_id, day_of_week, start_time, end_time } = req.body;
      
      // SQL query to update schedule information in the database
      const sqlQuery = `UPDATE schedule_table SET doctor_id=?, day_of_week=?, start_time=?, end_time=? WHERE id=?`;
  
      // Execute the SQL query with schedule information
      const [result] = await pool.query(sqlQuery, [doctor_id, day_of_week, start_time, end_time, id]);
    
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
        message: `Schedule with ID ${id} updated successfully`,
        data: { result: result },
      });
    } catch (error) {
      // Handle any errors that occur during the database operation
      console.error(`Error updating schedule info: ${error.message}`);
      res.status(500).json({ error: `Internal server error` });
      throw error; // Rethrow the error for further handling, if necessary
    }
  };
  

export {updateScheduleById, deleteScheduleById, createSchedule, getAllSchedule, getScheduleById } 