import pool from '../database/index.js';


const getAllAppointments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const offset = (page - 1) * limit;

    const sqlQuery = 'SELECT * FROM appointment_table LIMIT ?, ?';
    console.log('SQL Query:', sqlQuery);
    const [result] = await pool.query(sqlQuery, [offset, limit]);
    
    const totalCountQuery = 'SELECT COUNT(*) AS total FROM appointment_table';
    const [totalCountRows] = await pool.query(totalCountQuery);
    const totalRecords = totalCountRows[0].total;
  
    const jsonResponse = {
      status: 'success',
      result: result.length,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      data: { result: result },
      totalItems: totalRecords
    };

    console.log('JSON Response:', JSON.stringify(jsonResponse, null, 2));
    res.status(200).json(jsonResponse);
  } catch (err) {
    console.error(`Error retrieving appointments: ${err}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


  const createAppointment = async (req, res, next) => {
    try {
        const { patient_id, assigned_doctor_id, appointment_time_slot_id } = req.body;

        // Query to check if the time slot is already booked
        const checkQuery = `
            SELECT COUNT(*) AS count FROM appointment_table 
            WHERE appointment_time_slot_id = ? 
            GROUP BY appointment_time_slot_id
        `;
        const [rows] = await pool.query(checkQuery, [appointment_time_slot_id]);

        // If count is greater than 0, the time slot is already booked
        if (rows.length > 0 && rows[0].count > 0) {
            return res.status(400).json({ error: 'Appointment time slot is already booked' });
        }

        // Insert the appointment if the time slot is available
        const insertQuery = `
            INSERT INTO appointment_table (patient_id, assigned_doctor_id, appointment_time_slot_id)
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.query(insertQuery, [patient_id, assigned_doctor_id, appointment_time_slot_id]);

        // Ensure result.insertId is retrieved correctly
        const appointmentId = result.insertId;

        // Respond with the appointment ID
        res.status(200).json({
            status: 'success',
            message: 'Appointment booked successfully',
            data: {
                result: result,
                appointment_id: appointmentId // Include the appointment ID in the response
            }
        });
    } catch (error) {
        console.error(`Error creating appointment: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



  //deleting Appointment

  const deleteAppointmentById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const sqlQuery = `DELETE FROM appointment_table WHERE id = ?`;
      const [result] = await pool.query(sqlQuery, [id]);
      res.status(200).json({
        status: 'success',
        data: { result:result }
      });
    } catch (error) {
      console.error(`Error deleting appointment: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
      throw error.message;
    }
  };


  const getAppointmentById = async (req, res, next) => {
    try {
      // Extract patient ID from request parameters
      const id = req.params.id;
  
      // SQL query to select patient by ID from the database
      const sqlQuery = `SELECT * FROM appointment_table WHERE id = ?`;
      
      // Execute the SQL query with patient ID
      const [result] = await pool.query(sqlQuery, [id]);
  
      // Check if the result is empty, indicating patient with the given ID doesn't exist
      if (!result.length) {
        return res.status(404).json({
          status: 'error',
          message: `Appointment with ID ${id} not found`,
        });
      }
  
      // Send a success response with the patient data
      res.status(200).json({
        status: 'success',
        data: { result: result },
      });
    } catch (error) {
      // Handle any errors that occur during the database operation
      console.error(`Error retriviwing appointment: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
      throw error.message; // Rethrow the error for further handling, if necessary
    }
  };

   

const updateAppointmentById = async(req, res, next)=>{

  try {
    // Extract patient ID from request parameters
    const id = req.params.id;
    
    // Extract patient information from request body
    const { patient_id, assigned_doctor_id, appointment_time_slot_id, appointment_status } = req.body;
    
    // SQL query to update patient information in the database
    const sqlQuery = `UPDATE appointment_table SET  patient_id=?, assigned_doctor_id=?, appointment_time_slot_id =?, appointment_status=? WHERE id=?`;

    
    // Execute the SQL query with patient information
    const [result] = await pool.query(sqlQuery, [patient_id, assigned_doctor_id, appointment_time_slot_id, appointment_status, id]);
  
    // If no rows were affected by the update, it means the patient with the given ID wasn't found
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Cannot updating Appointment with ID ${id} not found`,
      });
    }
  
    // Send a success response with updated patient information
    res.status(200).json({
      status: 'success',
      message: `Appointment with ID ${id} updated successfully`,
      data: { result: result },
    });
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error(`Error updating appointment info ${error.message}`);
    res.status(500).json({ error: `Internal server` });
    throw error.message; // Rethrow the error for further handling, if necessary
  }
}  



// const getCurrentAppointment = async (req, res, next) => {
//   try {
//     const id = req.params.id;

//     const sqlQuery = `
//       SELECT
//         a.id AS appointment_id,
//         a.patient_id,
//         a.assigned_doctor_id,
//         a.appointment_time_slot_id,
//         dt.id AS doctor_time_slot_table_id,
//         dt.date,
//         dt.day_of_week,
//         dt.start_time,
//         dt.end_time,
//         dt.time_period
//       FROM
//         appointment_table a
//       JOIN
//         doctor_time_slot_table dt ON a.appointment_time_slot_id = dt.id
//       WHERE
//         dt.date = CURDATE();`;

//     const [result] = await pool.query(sqlQuery, [id]);

//     res.status(200).json({
//       status: "Success",
//       message: "The appointment was retrieved",
//       data: {
//         result: result
//       }
//     });
//   } catch (error) {
//     console.error('Error retrieving current appointment:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//     // Consider rethrowing the error for further handling, if necessary
//     // throw error;
//   }
// };



const getAllCurrentAppointment = async (req, res, next) => {
  try {
    const sqlQuery = `
      SELECT
        a.id AS appointment_id,
        a.patient_id,
        a.assigned_doctor_id,
        a.appointment_time_slot_id,
        dt.id AS doctor_time_slot_table_id,
        dt.date,
        dt.day_of_week,
        dt.start_time,
        dt.end_time,
        dt.time_period
      FROM
        appointment_table a
      JOIN
        doctor_time_slot_table dt ON a.appointment_time_slot_id = dt.id
      WHERE
        dt.date = CURDATE();`;

    const [result] = await pool.query(sqlQuery);

    res.status(200).json({
      status: "Success",
      message: "The appointments were retrieved",
      data: {
        appointments: result
      }
    });
  } catch (error) {
    console.error('Error retrieving current appointments:', error.message);
    res.status(500).json({ error: 'Internal server error' });
    // Consider rethrowing the error for further handling, if necessary
    // throw error;
  }
};



const getCountOfAppointmentsForToday = async (req, res, next) => {
  try {
    const sqlQuery = `
      SELECT COUNT(*) AS appointment_count
      FROM appointment_table a
      JOIN doctor_time_slot_table dt ON a.appointment_time_slot_id = dt.id
      WHERE dt.date = CURDATE();
    `;

    const [result] = await pool.query(sqlQuery);

    res.status(200).json({
      status: "success",
      message: "Appointment count for today retrieved successfully",
      data: {
        result: result[0]
      }
    });
  } catch (error) {
    console.error('Error retrieving appointment count for today:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const countAllAppointments = async (req, res, next) => {
  try {
    const sqlQuery = `SELECT COUNT(*) AS count FROM appointment_table`;
    const [result] = await pool.query(sqlQuery); // Await the query

    res.status(200).json({
      status: "Success",
      message: "Total count of appointments was successful",
      data: {
        result: result[0] // Access the first element which contains the count
      }
    });
  } catch (error) {
    console.error(`Internal Error: ${error.message}`);
    res.status(500).json({ error: 'Error getting all appointments' });
  }
};


export {updateAppointmentById, deleteAppointmentById, getAppointmentById, createAppointment,  getAllAppointments, getAllCurrentAppointment, getCountOfAppointmentsForToday, countAllAppointments}