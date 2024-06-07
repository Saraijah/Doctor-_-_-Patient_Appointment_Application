
import pool from '../database/index.js';
import { hashPassword, comparePasswords } from '../../js/authUtils.js';
import secretKey from '../../js/crypto.js';
import jwt from 'jsonwebtoken';
import verifyToken from '../middlewear/verifyToken.js';
import bcrypt from 'bcrypt';
import { hashSync } from 'bcrypt'; // Import the hashSync function from bcrypt

const getAllPatients = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 5;
      const offset = (page - 1) * limit;
  
      let sqlQuery = 'SELECT * FROM patient_table LIMIT ?, ?';
      console.log('SQL Query:', sqlQuery); // Log SQL query
      const [patients] = await pool.query(sqlQuery, [offset, limit]);
      
      const totalCountQuery = 'SELECT COUNT(*) AS total FROM patient_table';
      const [totalCountRows] = await pool.query(totalCountQuery);
      const totalRecords = totalCountRows[0].total;
  
      const jsonResponse = {
        status: 'success',
        result: patients.length,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        data: {result:patients},
        totalItems: totalRecords
      };

      console.log('JSON Response:', JSON.stringify(jsonResponse, null, 2)); // Log JSON response with proper formatting

      res.status(200).json(jsonResponse);
    } catch (err) {
      console.error(`Error retrieving patients: ${err}`); // Log the error message
      res.status(500).json({ error: 'Internal Server Error' });
    }
};





// const registerPatient = async (req, res, next) => {
//   try {
//     const { first_name, last_name, email, phone_number, dob, gender, address, password} = req.body;

//     // Log the received patient data for debugging purposes
//     console.log('Request body:', req.body);

//     // Hash the password before storing it
//     const hashedPassword = hashSync(password, 10); // Hash the password with salt rounds

//     // Log the hashed password for debugging purposes
//     console.log('Hashed Password:', hashedPassword);

//     // Check if file upload succeeded and get the filename
//     let imgPath = req.file ? req.file.path : null;

//     // Replace backslashes with forward slashes in the file path
//     if (imgPath) {
//       imgPath = imgPath.replace(/\\/g, '/');
//     }

//     // Define default role for patients
//     const defaultRole = 'patient';

//     // Query statement to create patients with predefined role
//     const sqlQuery = `
//       INSERT INTO patient_table (role, first_name, last_name, email, phone_number, dob, gender, address, password, img)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     // Execute the SQL query with patient data and default role
//     const result = await pool.query(sqlQuery, [defaultRole, first_name, last_name, email, phone_number, dob, gender, address, hashedPassword, imgPath]);

//     // Construct response data
//     const patientData = {
//       status: 'success',
//       message: 'Patient registered successfully',
//       data: result
//     };

//     // Send response to the client
//     res.status(200).json(patientData);
//   } catch (error) {
//     // Handle errors
//     console.error(`Error registering patients: ${error.message}`);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


const registerPatient = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone_number, dob, gender, address, password} = req.body;

    // Log the received patient data for debugging purposes
    console.log('Request body:', req.body);

    // Hash the password before storing it
    const hashedPassword = hashSync(password, 10); // Hash the password with salt rounds

    // Log the hashed password for debugging purposes
    console.log('Hashed Password:', hashedPassword);

    // Extract the date part from the date string
    const dobDate = dob.split('T')[0];

    // Check if file upload succeeded and get the filename
    let imgPath = req.file ? req.file.path : null;

    // Replace backslashes with forward slashes in the file path
    if (imgPath) {
      imgPath = imgPath.replace(/\\/g, '/');
    }

    // Define default role for patients
    const defaultRole = 'patient';

    // Query statement to create patients with predefined role
    const sqlQuery = `
      INSERT INTO patient_table (role, first_name, last_name, email, phone_number, dob, gender, address, password, img)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute the SQL query with patient data and default role
    const result = await pool.query(sqlQuery, [defaultRole, first_name, last_name, email, phone_number, dobDate, gender, address, hashedPassword, imgPath]);

    // Construct response data
    const patientData = {
      status: 'success',
      message: 'Patient registered successfully',
      data: result
    };

    // Send response to the client
    res.status(200).json(patientData);
  } catch (error) {
    // Handle errors
    console.error(`Error registering patients: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const deletePatient = async (req, res, next) => {
    try {
      const id = req.params.id;
      const sqlQuery = `DELETE FROM patient_table WHERE id = ?`;
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

const getPatientById = async (req, res, next) => {
    try {
      // Extract patient ID from request parameters
      const id = req.params.id;
  
      // SQL query to select patient by ID from the database
      const sqlQuery = `SELECT * FROM patient_table WHERE id = ?`;
      
      // Execute the SQL query with patient ID
      const [result] = await pool.query(sqlQuery, [id]);
  
      // Check if the result is empty, indicating patient with the given ID doesn't exist
      if (!result.length) {
        return res.status(404).json({
          status: 'error',
          message: `Patient with ID ${id} not found`,
        });
      }
  
      // Send a success response with the patient data
      res.status(200).json({
        status: 'success',
        data: { result: result },
      });
    } catch (error) {
      // Handle any errors that occur during the database operation
      console.error(`Error getting patient: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
      throw error.message; // Rethrow the error for further handling, if necessary
    }
};



const updatePatientById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let { first_name, last_name, email, phone_number, dob, gender, address, password, medical_history } = req.body;
    let imgPath = req.file ? req.file.path.replace(/\\/g, '/') : null;

    console.log(`REQ.BODY : ${JSON.stringify(req.body)}`);
    if (req.file) {
      console.log(`Received file: ${req.file.filename}`); // Log the received file
    }

    if (imgPath) {
      console.log(`Image path: ${imgPath}`);
      imgPath = imgPath.replace(/\\/g, '/');
    }

    let sqlQuery = 'UPDATE patient_table SET ';
    const params = [];

    if (first_name) {
      sqlQuery += 'first_name=?, ';
      params.push(first_name);
    }

    if (last_name) {
      sqlQuery += 'last_name=?, ';
      params.push(last_name);
    }

    if (email) {
      sqlQuery += 'email=?, ';
      params.push(email);
    }

    if (phone_number) {
      sqlQuery += 'phone_number=?, ';
      params.push(phone_number);
    }

    if (dob) {
      dob = dob.split('T')[0];
      sqlQuery += 'dob=?, ';
      params.push(dob);
    }

    if (gender) {
      sqlQuery += 'gender=?, ';
      params.push(gender);
    }

    if (address) {
      sqlQuery += 'address=?, ';
      params.push(address);
    }

    if (password) {
      const hashedPassword = hashSync(password, 10); // Hash the new password
      console.log('Hashed Password:', hashedPassword);
      sqlQuery += 'password=?, ';
      params.push(hashedPassword);
    }

    if (imgPath) {
      sqlQuery += 'img=?, ';
      params.push(imgPath);
    }

    if (medical_history) {
      sqlQuery += 'medical_history=?, ';
      params.push(medical_history);
    }

    if (params.length > 0) {
      sqlQuery = sqlQuery.slice(0, -2); // Remove the last comma and space
    } else {
      return res.status(400).json({ error: 'No fields provided for updating' });
    }

    sqlQuery += ' WHERE id = ?';
    params.push(id);

    console.log('Final SQL Query:', sqlQuery);
    console.log('SQL Parameters:', params);

    const [updateResult] = await pool.query(sqlQuery, params);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const [updatedPatient] = await pool.query('SELECT * FROM patient_table WHERE id = ?', [id]);

    if (!updatedPatient.length) {
      throw new Error('Patient not found after update');
    }

    console.log('Updated Patient Data:', updatedPatient[0]);

    res.status(200).json({
      status: 'success',
      data: { result: updatedPatient[0] },
    });
  } catch (error) {
    console.error(`Error updating patient info: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};






const findPatientByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM patient_table WHERE email = ?', [email]);
  return rows[0];
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await findPatientByEmail(email);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If login successful, generate JWT using the secret key
    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '2h' });

    // Prepare user information to be returned (excluding sensitive data)
    const userInfo = {
      id: user.id,
      role: user.role,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      dob: user.dob,
      gender: user.gender,
      address: user.address,
      medical_history: user.medical_history,
      img: user.img,
    };

    // Store user ID in the session
    req.session.userId = user.id;
    console.log('Session userId set:', req.session.userId); // Log the session userId

    // Return the JWT token, user info, and session ID in the response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: userInfo,
      sessionId: req.sessionID // Include session ID in the response
    });
  } catch (error) {
    console.error(`Error logging in: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getPatientAppointmentsById = async (req, res, next) => {
  try {
    const patientId = req.params.id;

    // SQL query to select appointments with associated time details by patient ID, ordered by date
    const sqlQuery = `
      SELECT 
        a.id AS appointment_id, 
        a.patient_id, 
        a.assigned_doctor_id, 
        d.img,
        d.first_name,
        d.last_name, 
        a.appointment_time_slot_id, 
        t.start_time, 
        t.end_time,
        t.date,
        a.appointment_status
      FROM appointment_table a
      JOIN doctor_time_slot_table t ON a.appointment_time_slot_id = t.id
      JOIN doctors_table d ON a.assigned_doctor_id = d.id
      WHERE a.patient_id = ?
      ORDER BY t.date;
    `;
    const [result] = await pool.query(sqlQuery, [patientId]);

    // Check if the result is empty, indicating no appointments for the given patient ID
    if (!result.length) {
      return res.status(404).json({
        status: 'error',
        message: `No appointments found for patient with ID ${patientId}`,
      });
    }

    // Send a success response with the appointment data
    res.status(200).json({
      status: 'success',
      data: { appointments: result },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error;
  }
};

                                                                                                  
const searchPatientAppointments = async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm;
    const patientId = req.params.id; // Extract patient ID from URL params

    console.log('Received Search Term:', searchTerm);
    console.log('Received Patient ID:', patientId);

    // Construct the SQL query with  filtering
    let sqlQuery = `
      SELECT 
        a.id AS appointment_id, 
        a.patient_id, 
        a.assigned_doctor_id, 
        d.img,
        d.first_name,
        d.last_name, 
        a.appointment_time_slot_id, 
        t.start_time, 
        t.end_time,
        t.date
      FROM appointment_table a
      JOIN doctor_time_slot_table t ON a.appointment_time_slot_id = t.id
      JOIN doctors_table d ON a.assigned_doctor_id = d.id
      WHERE a.patient_id = ? 
        AND (
          d.first_name LIKE ? 
          OR d.last_name LIKE ? 
          OR t.date LIKE ?
        )`;

    // Include the search term and patient ID in the SQL query parameters
    const [result] = await pool.query(sqlQuery, [
      patientId, // Filter by patient ID
      `%${searchTerm}%`, // Filter by doctor's first name
      `%${searchTerm}%`, // Filter by doctor's last name
      `%${searchTerm}%`, // Filter by appointment date
    ]);

    // If no appointments are found, return a 404 error
    if (!result.length) {
      return res.status(404).json({
        status: 'error',
        message: 'No appointments found',
      });
    }

    // Return the search results
    res.status(200).json({
      status: 'success',
      data: { appointments: result },
    });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error;
  }
};


const deleteProfileImg = async (req, res, next) => {
  try {
    // Ensure id is a valid integer
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      // Return a bad request response if id is not a valid integer
      return res.status(400).json({
        status: 'error',
        message: 'Invalid id',
      });
    }

    const sqlQuery = `UPDATE patient_table SET img = NULL WHERE id = ?`;
    const [result] = await pool.query(sqlQuery, [id]);

    // Send a success response with the updated patient data
    res.status(200).json({
      status: 'success',
      data: { result: result },
    });
  } catch (error) {
    // Send an error response if an error occurs
    console.error(`Error removing img: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};


const uploadPatientPhoto = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
      });
    }

    // Get the filename and replace backslashes with forward slashes
    let imagePath = req.file.path.replace(/\\/g, '/');

    // Update the patient's img column with the new image path
    const sqlQuery = `UPDATE patient_table SET img = ? WHERE id = ?`;
    const [result] = await pool.query(sqlQuery, [imagePath, id]);

    res.status(200).json({
      message: 'Success',
      result: result,
    });
  } catch (error) {
    console.error(`Internal server error: ${error}`);
    res.status(500).json({
      message: 'Internal server error',
      error: error,
    });
  }
};


const countAllPatients = async (req, res, next) => {
  try {
    const sqlQuery = `SELECT COUNT(*) AS count FROM patient_table`;
    const [result] = await pool.query(sqlQuery); // Await the query

    res.status(200).json({
      status: "Success",
      message: "Total count of patients was successful",
      data: {
        result: result[0] // Access the first element which contains the count
      }
    });
  } catch (error) {
    console.error(`Internal Error: ${error.message}`);
    res.status(500).json({ error: 'Error getting all patients' });
  }
};


export { getAllPatients, registerPatient, deletePatient, getPatientById, updatePatientById, findPatientByEmail, loginUser, getPatientAppointmentsById, searchPatientAppointments,deleteProfileImg , uploadPatientPhoto, countAllPatients};
