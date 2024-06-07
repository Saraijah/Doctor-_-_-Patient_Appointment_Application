// import pool from '../database/index.js';
// import { hashPassword, comparePasswords } from '../../js/authUtils.js';
// import secretKey from '../../js/crypto.js';
// import jwt from 'jsonwebtoken';
// import verifyToken from '../middlewear/verifyToken.js';
// import { hashSync } from 'bcrypt';



// const getAllDoctors = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 5;
//     const offset = (page - 1) * limit;

//     let sqlQuery = 'SELECT * FROM doctors_table LIMIT ?, ?';
//     console.log('SQL Query:', sqlQuery); // Log SQL query
//     const [doctors] = await pool.query(sqlQuery, [offset, limit]);
    
//     const totalCountQuery = 'SELECT COUNT(*) AS total FROM doctors_table';
//     const [totalCountRows] = await pool.query(totalCountQuery);
//     const totalRecords = totalCountRows[0].total;

//     const jsonResponse = {
//       status: 'success',
//       result: doctors.length,
//       totalPages: Math.ceil(totalRecords / limit),
//       currentPage: page,
//       totalItems: totalRecords,
//       data: {
//         result: doctors 
//       }
//     };

//     console.log('JSON Response:', JSON.stringify(jsonResponse, null, 2)); // Log JSON response with proper formatting

//     res.status(200).json(jsonResponse); // Send jsonResponse directly
//   } catch (err) {
//     console.error(`Internal error ${err}`);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const createDoctor = async (req, res, next) => {
//   try {
//     const {
//       department_id, title, first_name, last_name, email, phone_number,
//       dob, address, experience, Qualifications, specialization, bio,
//       consultation_fee, status, office_name, password
//     } = req.body;

//     // Log the received patient data for debugging purposes
//     console.log('Request body:', req.body);

//     // Default role if not provided
//     const role = req.body.role || 'doctor';

//     // Validate required fields

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

//     // Extract the date part from the date string
//     let dobDate;
//     try {
//       dobDate = dob.split('T')[0];
//     } catch (error) {
//       return res.status(400).json({ error: 'Invalid date of birth format' });
//     }

//     const sqlQuery = `
//       INSERT INTO doctors_table (
//         department_id, role, title, first_name, last_name, email, phone_number,
//         dob, address, experience, Qualifications, specialization, bio,
//         consultation_fee, status, img, office_name, password
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const result = await pool.query(sqlQuery, [
//       department_id, role, title, first_name, last_name, email, phone_number,
//       dobDate, address, experience, Qualifications, specialization, bio,
//       consultation_fee, status, imgPath, office_name, hashedPassword
//     ]);

//     res.status(200).json({
//       status: 'success',
//       message: 'Doctor registered successfully',
//       data: result
//     });
//   } catch (error) {
//     console.error(`Error registering doctor: ${error.message}`);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };







//   //deleting doctors

//   const deleteDoctorById = async (req, res, next) => {
//     try {
//       const id = req.params.id;
//       const sqlQuery = `DELETE FROM doctors_table WHERE id = ?`;
//       const [result] = await pool.query(sqlQuery, [id]);
//       res.status(200).json({
//         status: 'success',
//         data: { result:result }
//       });
//     } catch (error) {
//       console.error(`Error deleting patient: ${error.message}`);
//       res.status(500).json({ error: 'Internal Server Error' });
//       throw error.message;
//     }
//   };


//   const getDoctorById = async (req, res, next) => {
//     try {
//       // Extract patient ID from request parameters
//       const id = req.params.id;
  
//       // SQL query to select patient by ID from the database
//       const sqlQuery = `SELECT * FROM doctors_table WHERE id = ?`;
      
//       // Execute the SQL query with patient ID
//       const [result] = await pool.query(sqlQuery, [id]);
  
//       // Check if the result is empty, indicating patient with the given ID doesn't exist
//       if (!result.length) {
//         return res.status(404).json({
//           status: 'error',
//           message: `Doctor with ID ${id} not found`,
//         });
//       }
  
//       // Send a success response with the patient data
//       res.status(200).json({
//         status: 'success',
//         data: { result: result },
//       });
//     } catch (error) {
//       // Handle any errors that occur during the database operation
//       console.error(`Error getting Doctor: ${error.message}`);
//       res.status(500).json({ error: 'Internal Server Error' });
//       throw error.message; // Rethrow the error for further handling, if necessary
//     }
//   };
  
  

//   const updateDoctorById = async (req, res, next) => {
//     try {
//       const id = req.params.id;
//       const { department_id,role ,title, first_name, last_name, email, phone_number, dob, address, experience, Qualifications, specialization, bio, consultation_fee, status, img, office_name, password } = req.body;
//       const hashedPassword = await hashPassword(password);
  
//       const sqlQuery = `
//         UPDATE doctors_table 
//         SET department_id=?, role=? ,title=?, first_name=?, last_name=?, email=?, phone_number=?, dob=?, address=?, experience=?, Qualifications=?, specialization=?, bio=?, consultation_fee=?, status=?, img=?, office_name=?, password=? 
//         WHERE id=?
//       `;
//       const [result] = await pool.query(sqlQuery, [department_id, role ,title, first_name, last_name, email, phone_number, dob, address, experience, Qualifications, specialization, bio, consultation_fee, status, img, office_name, hashedPassword, id]);
  
//       if (result.affectedRows === 0) {
//         return res.status(404).json({
//           status: 'error',
//           message: `Doctor with ID ${id} not found`,
//         });
//       }
  
//       res.status(200).json({
//         status: 'success',
//         message: `Doctor with ID ${id} updated successfully`,
//       });
//     } catch (error) {
//       console.error(`Error updating doctor info: ${error.message}`);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };
  
  



// // Function to find a patient by email
// const findDoctorByEmail = async (email) => {
//   const [rows] = await pool.execute('SELECT * FROM doctors_table WHERE email = ?', [email]);
//   return rows[0];
// };


// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find doctor by email
//     const user = await findDoctorByEmail(email);

//     // Log the user found (or not found)
//     console.log('User:', user);

//     // Check if user exists
//     if (!user) {
//       console.log('User not found');
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Compare passwords
//     const isPasswordValid = await comparePasswords(password, user.password);

//     if (!isPasswordValid) {
//       console.log('Invalid credentials');
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // If login successful, generate JWT using the secret key
//     const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '2h' });

//     // Log the generated token
//     console.log('Generated token:', token);

//     const userInfo = {
//       id: user.id,
//       role: user.role,
//       department_id: user.department_id,
//       title: user.title,
//       first_name: user.first_name,
//       last_name: user.last_name,
//       email: user.email,
//       phone_number: user.phone_number,
//       dob: user.dob,
//       address: user.address,
//       experience: user.experience,
//       Qualifications: user.Qualifications,
//       specialization: user.specialization,
//       bio: user.bio,
//       consultation_fee: user.consultation_fee,
//       status: user.status,
//       img: user.img,
//       office_name: user.office_name,
//     };


//     req.session.userId = user.id;
//     console.log('Session userId set:', req.session.userId); // Log the session userId


//     // Return the JWT token and user info in the response
//     res.status(200).json({
//       message: 'Doctor successfully logged in',
//       user: userInfo,
//       userType: 'doctor',
//       role:'doctor',
//       sessionId: req.sessionID,
//       token
//     });
//   } catch (error) {
//     console.error(`Error logging in: ${error.message}`);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };



// const getDoctorAvailableById = async (req, res, next) => {
//   try {
//     const doctorId = req.params.id; // Get doctor id from request parameters

//     // Query to retrieve the available time slots
//     const query = `
//       SELECT 
//           ts.id AS time_slot_id,
//           ts.doctor_id,
//           ts.date,
//           ts.day_of_week,
//           ts.start_time,
//           ts.end_time,
//           ts.time_period,
//           d.id AS doctor_id,
//           d.department_id,
//           d.role,
//           d.title,
//           d.first_name,
//           d.last_name,
//           d.email,
//           d.phone_number,
//           d.dob,
//           d.address,
//           d.experience,
//           d.qualifications,
//           d.specialization,
//           d.bio,
//           d.consultation_fee,
//           d.status,
//           d.img,
//           d.office_name
//       FROM 
//           doctor_time_slot_table ts
//       JOIN 
//           doctors_table d ON ts.doctor_id = d.id
//       LEFT JOIN 
//           appointment_table a ON ts.id = a.appointment_time_slot_id
//       WHERE 
//           ts.doctor_id = ? AND a.appointment_time_slot_id IS NULL;`;

//     // Execute the main query to retrieve available time slots
//     const results = await pool.query(query, [doctorId]);

//     // Query to retrieve the count of available time slots
//     const countQuery = `
//       SELECT 
//           COUNT(ts.id) AS total_items
//       FROM 
//           doctor_time_slot_table ts
//       LEFT JOIN 
//           appointment_table a ON ts.id = a.appointment_time_slot_id
//       WHERE 
//           ts.doctor_id = ? AND a.appointment_time_slot_id IS NULL;`;

//     // Execute the count query
//     const countResult = await pool.query(countQuery, [doctorId]);

//     // Extract the count value
//     const totalItems = countResult[0].total_items;

//     // Send the results back as a response
//     res.json({
//       status: 'success',
//       data: {
//         result: results,
      
//       },
//       total_items: totalItems
//     });
//   } catch (error) {
//     console.error(`Error retrieving available time slots: ${error.message}`);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

 

// const countAllDocrors = async (req, res, next) => {
//   try {
//     const sqlQuery = `SELECT COUNT(*) AS count FROM doctors_table`;
//     const [result] = await pool.query(sqlQuery); // Await the query

//     res.status(200).json({
//       status: "Success",
//       message: "Total count of doctors was successful",
//       data: {
//         result: result[0] // Access the first element which contains the count
//       }
//     });
//   } catch (error) {
//     console.error(`Internal Error: ${error.message}`);
//     res.status(500).json({ error: 'Error getting all doctors' });
//   }



// const deleteProfile = async (req, res, next) => {
//     try {
//       // Ensure id is a valid integer
//       const id = parseInt(req.params.id);
  
//       if (isNaN(id)) {
//         // Return a bad request response if id is not a valid integer
//         return res.status(400).json({
//           status: 'error',
//           message: 'Invalid id',
//         });
//       }
  
//       const sqlQuery = `UPDATE doctors_table  SET img = NULL WHERE id = ?`;
//       const [result] = await pool.query(sqlQuery, [id]);
  
//       // Send a success response with the updated patient data
//       res.status(200).json({
//         status: 'success',
//         data: { result: result },
//       });
//     } catch (error) {
//       // Send an error response if an error occurs
//       console.error(`Error removing img: ${error.message}`);
//       res.status(500).json({
//         status: 'error',
//         message: 'Internal server error',
//       });
//     }
//   };
// };


// export {updateDoctorById,  getDoctorById, createDoctor, deleteDoctorById, getAllDoctors, loginUser, getDoctorAvailableById, countAllDocrors }


import pool from '../database/index.js';
import { hashPassword, comparePasswords } from '../../js/authUtils.js';
import secretKey from '../../js/crypto.js';
import jwt from 'jsonwebtoken';
import verifyToken from '../middlewear/verifyToken.js';
import { hashSync } from 'bcrypt';

const getAllDoctors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const offset = (page - 1) * limit;

    let sqlQuery = 'SELECT * FROM doctors_table LIMIT ?, ?';
    console.log('SQL Query:', sqlQuery); // Log SQL query
    const [doctors] = await pool.query(sqlQuery, [offset, limit]);

    const totalCountQuery = 'SELECT COUNT(*) AS total FROM doctors_table';
    const [totalCountRows] = await pool.query(totalCountQuery);
    const totalRecords = totalCountRows[0].total;

    const jsonResponse = {
      status: 'success',
      result: doctors.length,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      totalItems: totalRecords,
      data: {
        result: doctors 
      }
    };

    console.log('JSON Response:', JSON.stringify(jsonResponse, null, 2)); // Log JSON response with proper formatting

    res.status(200).json(jsonResponse); // Send jsonResponse directly
  } catch (err) {
    console.error(`Internal error ${err}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createDoctor = async (req, res, next) => {
  try {
    const {
      department_id, title, first_name, last_name, email, phone_number,
      dob, address, experience, Qualifications, specialization, bio,
      consultation_fee, status, office_name, password
    } = req.body;

    console.log('Request body:', req.body);

    const role = req.body.role || 'doctor';

    const hashedPassword = hashSync(password, 10); // Hash the password with salt rounds

    console.log('Hashed Password:', hashedPassword);

    let imgPath = req.file ? req.file.path : null;

    if (imgPath) {
      imgPath = imgPath.replace(/\\/g, '/');
    }

    let dobDate;
    try {
      dobDate = dob.split('T')[0];
    } catch (error) {
      return res.status(400).json({ error: 'Invalid date of birth format' });
    }

    const sqlQuery = `
      INSERT INTO doctors_table (
        department_id, role, title, first_name, last_name, email, phone_number,
        dob, address, experience, Qualifications, specialization, bio,
        consultation_fee, status, img, office_name, password
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await pool.query(sqlQuery, [
      department_id, role, title, first_name, last_name, email, phone_number,
      dobDate, address, experience, Qualifications, specialization, bio,
      consultation_fee, status, imgPath, office_name, hashedPassword
    ]);

    res.status(200).json({
      status: 'success',
      message: 'Doctor registered successfully',
      data: result
    });
  } catch (error) {
    console.error(`Error registering doctor: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteDoctorById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const sqlQuery = `DELETE FROM doctors_table WHERE id = ?`;
    const [result] = await pool.query(sqlQuery, [id]);
    res.status(200).json({
      status: 'success',
      data: { result: result }
    });
  } catch (error) {
    console.error(`Error deleting patient: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error.message;
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const sqlQuery = `SELECT * FROM doctors_table WHERE id = ?`;
    const [result] = await pool.query(sqlQuery, [id]);

    if (!result.length) {
      return res.status(404).json({
        status: 'error',
        message: `Doctor with ID ${id} not found`,
      });
    }

    res.status(200).json({
      status: 'success',
      data: { result: result },
    });
  } catch (error) {
    console.error(`Error getting Doctor: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error.message;
  }
};

const updateDoctorById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { 
      department_id, role, title, first_name, last_name, email, phone_number, 
      dob, address, experience, Qualifications, specialization, bio, 
      consultation_fee, status, office_name 
    } = req.body;
    
    let { password, img } = req.body;

    // Handle password hashing if password is provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await hashPassword(password);
    }

    // Handle file upload
    let imgPath = img;
    if (req.file) {
      console.log(`Received file: ${req.file.filename}`);
      imgPath = req.file.path.replace(/\\/g, '/');
    }

    console.log(`REQ.BODY : ${JSON.stringify(req.body)}`);
    if (imgPath) {
      console.log(`Image path: ${imgPath}`);
    }

    // Construct the SQL query with only provided fields
    const fieldsToUpdate = [
      department_id, role, title, first_name, last_name, email, phone_number, 
      dob, address, experience, Qualifications, specialization, bio, 
      consultation_fee, status, imgPath, office_name
    ];

    // Add password to update if it's provided
    let sqlQuery = `
      UPDATE doctors_table 
      SET department_id=?, role=?, title=?, first_name=?, last_name=?, email=?, 
      phone_number=?, dob=?, address=?, experience=?, Qualifications=?, 
      specialization=?, bio=?, consultation_fee=?, status=?, img=?, office_name=?`;

    if (hashedPassword) {
      sqlQuery += `, password=?`;
      fieldsToUpdate.push(hashedPassword);
    }

    sqlQuery += ` WHERE id=?`;
    fieldsToUpdate.push(id);

    const [result] = await pool.query(sqlQuery, fieldsToUpdate);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Doctor with ID ${id} not found`,
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Doctor with ID ${id} updated successfully`,
    });
  } catch (error) {
    console.error(`Error updating doctor info: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};









const findDoctorByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM doctors_table WHERE email = ?', [email]);
  return rows[0];
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findDoctorByEmail(email);

    console.log('User:', user);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      console.log('Invalid credentials');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '2h' });

    console.log('Generated token:', token);

    const userInfo = {
      id: user.id,
      role: user.role,
      department_id: user.department_id,
      title: user.title,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      dob: user.dob,
      address: user.address,
      experience: user.experience,
      Qualifications: user.Qualifications,
      specialization: user.specialization,
      bio: user.bio,
      consultation_fee: user.consultation_fee,
      status: user.status,
      img: user.img,
      office_name: user.office_name,
    };

    req.session.userId = user.id;
    console.log('Session userId set:', req.session.userId);

    res.status(200).json({
      message: 'Doctor successfully logged in',
      user: userInfo,
      userType: 'doctor',
      role: 'doctor',
      sessionId: req.sessionID,
      token
    });
  } catch (error) {
    console.error(`Error logging in: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getDoctorAvailableById = async (req, res, next) => {
  try {
    const doctorId = req.params.id;

    const query = `
      SELECT 
          ts.id AS time_slot_id,
          ts.doctor_id,
          ts.date,
          ts.day_of_week,
          ts.start_time,
          ts.end_time,
          ts.time_period,
          d.id AS doctor_id,
          d.department_id,
          d.role,
          d.title,
          d.first_name,
          d.last_name,
          d.email,
          d.phone_number,
          d.dob,
          d.address,
          d.experience,
          d.qualifications,
          d.specialization,
          d.bio,
          d.consultation_fee,
          d.status,
          d.img,
          d.office_name
      FROM 
          doctor_time_slot_table ts
      JOIN 
          doctors_table d ON ts.doctor_id = d.id
      LEFT JOIN 
          appointment_table a ON ts.id = a.appointment_time_slot_id
      WHERE 
          ts.doctor_id = ? AND a.appointment_time_slot_id IS NULL;`;

    const results = await pool.query(query, [doctorId]);

    const countQuery = `
      SELECT 
          COUNT(ts.id) AS total_items
      FROM 
          doctor_time_slot_table ts
      LEFT JOIN 
          appointment_table a ON ts.id = a.appointment_time_slot_id
      WHERE 
          ts.doctor_id = ? AND a.appointment_time_slot_id IS NULL;`;

    const countResult = await pool.query(countQuery, [doctorId]);

    const totalItems = countResult[0].total_items;

    res.json({
      status: 'success',
      data: {
        result: results,
      },
      total_items: totalItems
    });
  } catch (error) {
    console.error(`Error retrieving available time slots: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

const countAllDocrors = async (req, res, next) => {
  try {
    const sqlQuery = `SELECT COUNT(*) AS count FROM doctors_table`;
    const [result] = await pool.query(sqlQuery);

    res.status(200).json({
      status: "Success",
      message: "Total count of doctors was successful",
      data: {
        result: result[0]
      }
    });
  } catch (error) {
    console.error(`Internal Error: ${error.message}`);
    res.status(500).json({ error: 'Error getting all doctors' });
  }
};

const deleteProfileImg = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid id',
      });
    }

    const sqlQuery = `UPDATE doctors_table SET img = NULL WHERE id = ?`;
    const [result] = await pool.query(sqlQuery, [id]);

    res.status(200).json({
      status: 'success',
      data: { result: result },
    });
  } catch (error) {
    console.error(`Error removing img: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export { updateDoctorById, getDoctorById, createDoctor, deleteDoctorById, getAllDoctors, loginUser, getDoctorAvailableById, countAllDocrors, deleteProfileImg };
