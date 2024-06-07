import pool from '../database/index.js';

const getAllTime = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 5;
      const offset = (page - 1) * limit;
  
      let sqlQuery = 'SELECT * FROM doctor_time_slot_table LIMIT ?, ?';
      console.log('SQL Query:', sqlQuery); // Log SQL query
      const [time] = await pool.query(sqlQuery, [offset, limit]);
      
      const totalCountQuery = 'SELECT COUNT(*) AS total FROM doctor_time_slot_table';
      const [totalCountRows] = await pool.query(totalCountQuery);
      const totalRecords = totalCountRows[0].total;
  
      const jsonResponse = {
        status: 'success',
        result: time.length,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        data: time,
        totalItems: totalRecords
      };

      
  
      console.log('JSON Response:', JSON.stringify(jsonResponse, null, 2)); // Log JSON response with proper formatting

      res.status(200).json({
        status: 'success',
        status: 'success',
        result: time.length,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        data: {result:time},
        totalItems: totalRecords
     
      });
    } catch (err) {
      console.error(`Error retrieving Time Slot: ${err}`); // Log the error message
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  const createTimeSlot = async (req, res, next) => {
    try {
        const { doctor_id, date, day_of_week, start_time, end_time, time_period } = req.body;

        console.log('Request Body:', req.body);

        // Validate the input fields
        if (!doctor_id || !date || !day_of_week || !start_time || !end_time || !time_period) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Convert date to the desired format if necessary
        const convertToDateFormat = (dateString) => {
            let formattedDate;
            try {
                formattedDate = dateString.split('T')[0];
            } catch (error) {
                throw new Error('Invalid date format');
            }
            return formattedDate;
        };

        let formattedDate;
        try {
            formattedDate = convertToDateFormat(date);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid date format. Expected YYYY-MM-DD.' });
        }

        // Convert time to 24-hour format
        const convertTo24HourFormat = (time, period) => {
            if (!time || !period) {
                throw new Error('Invalid time or period');
            }

            let [hours, minutes] = time.split(':').map(Number);
            if (isNaN(hours) || isNaN(minutes)) {
                throw new Error('Invalid time format');
            }

            if (period === 'PM' && hours < 12) {
                hours += 12;
            } else if (period === 'AM' && hours === 12) {
                hours = 0;
            }

            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        };

        console.log(`Converting start_time: ${start_time} ${time_period}`);
        const formattedStartTime = convertTo24HourFormat(start_time, time_period);

        console.log(`Converting end_time: ${end_time} ${time_period}`);
        const formattedEndTime = convertTo24HourFormat(end_time, time_period);

        // Query statement to create schedule
        const sqlQuery = `
            INSERT INTO doctor_time_slot_table (doctor_id, date, day_of_week, start_time, end_time)
            VALUES (?, ?, ?, ?, ?)
        `;

        const result = await pool.query(sqlQuery, [doctor_id, formattedDate, day_of_week, formattedStartTime, formattedEndTime]);

        res.status(200).json({
            status: 'success',
            message: 'Time Slot added successfully',
            data: { result }
        });
    } catch (error) {
        console.error(`Error Creating Time slot: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
        throw error;
    }
};



  //deleting schedule

  const deleteTimeById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const sqlQuery = `DELETE FROM  doctor_time_slot_table WHERE id = ?`;
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


  const getSTimeById = async (req, res, next) => {
    try {
      // Extract patient ID from request parameters
      const id = req.params.id;
  
      // SQL query to select patient by ID from the database
      const sqlQuery = `SELECT * FROM  doctor_time_slot_table WHERE id = ?`;
      
      // Execute the SQL query with patient ID
      const [result] = await pool.query(sqlQuery, [id]);
  
      // Check if the result is empty, indicating patient with the given ID doesn't exist
      if (!result.length) {
        return res.status(404).json({
          status: 'error',
          message: `Time with ID ${id} not found`,
        });
      }
  
      // Send a success response with the patient data
      res.status(200).json({
        status: 'success',
        data: { result: result },
      });
    } catch (error) {
      // Handle any errors that occur during the database operation
      console.error(`Error receiving Time: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
      throw error.message; // Rethrow the error for further handling, if necessary
    }
  };
  
  
  const updateTimeById = async (req, res, next) => {
    try {
      // Extract time slot ID from request parameters
      const id = req.params.id;
  
      // Extract time slot information from request body
      const { doctor_id, date, day_of_week, start_time, end_time, time_period } = req.body;
  
      console.log('Request Body:', req.body);
  
      // Validate the input fields
      if (!doctor_id || !date || !day_of_week || !start_time || !end_time || !time_period) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Convert date to the desired format if necessary
      const convertToDateFormat = (dateString) => {
        let formattedDate;
        try {
          formattedDate = dateString.split('T')[0];
        } catch (error) {
          throw new Error('Invalid date format');
        }
        return formattedDate;
      };
  
      let formattedDate;
      try {
        formattedDate = convertToDateFormat(date);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid date format. Expected YYYY-MM-DD.' });
      }
  
      // Convert time to 24-hour format
      const convertTo24HourFormat = (time, period) => {
        if (!time || !period) {
          throw new Error('Invalid time or period');
        }
  
        let [hours, minutes] = time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) {
          throw new Error('Invalid time format');
        }
  
        if (period === 'PM' && hours < 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
  
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        };
  
      console.log(`Converting start_time: ${start_time} ${time_period}`);
      const formattedStartTime = convertTo24HourFormat(start_time, time_period);
  
      console.log(`Converting end_time: ${end_time} ${time_period}`);
      const formattedEndTime = convertTo24HourFormat(end_time, time_period);
  
      // SQL query to update time slot information in the database
      const sqlQuery = `
        UPDATE doctor_time_slot_table 
        SET doctor_id=?, date=?, day_of_week=?, start_time=?, end_time=?, time_period=? 
        WHERE id=?
      `;
  
      // Execute the SQL query with time slot information
      const [result] = await pool.query(sqlQuery, [doctor_id, formattedDate, day_of_week, formattedStartTime, formattedEndTime, time_period, id]);
  
      // If no rows were affected by the update, it means the time slot with the given ID wasn't found
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: `Cannot update Time Slot with ID ${id}, not found`,
        });
      }
  
      // Send a success response with updated time slot information
      res.status(200).json({
        status: 'success',
        message: `Time Slot with ID ${id} updated successfully`,
        data: { result }
      });
    } catch (error) {
      // Handle any errors that occur during the database operation
      console.error(`Error updating Time Slot info: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
      throw error; // Rethrow the error for further handling, if necessary
    }
  };
  


  const getTimeSlotByDoctorId = async (req, res, next) => {
    try {
      const id = req.params.id;
      const sqlQuery = `SELECT * FROM doctor_time_slot_table WHERE doctor_id = ?`;
      const [result] = await pool.query(sqlQuery, [id]);
  
      if (result.length === 0) {
        return res.status(404).json({
          status: "fail",
          message: "No time slots found for the specified doctor ID"
        });
      }
  
      res.status(200).json({
        status: "success",
        data: {
          result: result
        }
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: "Failed to retrieve information",
        error: {
          message: error.message
        }
      });
  
      throw error.message;
    }
  };
  

export { updateTimeById, getSTimeById, deleteTimeById, createTimeSlot, getAllTime, getTimeSlotByDoctorId } 