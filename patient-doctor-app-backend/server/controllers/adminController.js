import pool from '../database/index.js';
import { hashPassword, comparePasswords } from '../../js/authUtils.js';
import secretKey from '../../js/crypto.js';
import jwt from 'jsonwebtoken';
import verifyToken from '../middlewear/verifyToken.js';
import { hashSync } from 'bcrypt';

const getAllAdmins = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const offset = (page - 1) * limit;

    let sqlQuery = 'SELECT * FROM admin_table LIMIT ?, ?';
    console.log('SQL Query:', sqlQuery); // Log SQL query
    const [admins] = await pool.query(sqlQuery, [offset, limit]);
    const totalCountQuery = 'SELECT COUNT(*) AS total FROM admin_table';
    const [totalCountRows] = await pool.query(totalCountQuery);
    const totalRecords = totalCountRows[0].total;

    const jsonResponse = {
      status: 'success',
      result: admins.length,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      data: admins,
      totalItems: totalRecords
    };

    console.log('JSON Response:', JSON.stringify(jsonResponse, null, 2)); // Log JSON response with proper formatting


    res.status(200).json({
      status: 'success',
      result: admins.length,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      data: {admins} ,
      totalItems: totalRecords
    });
  } catch (err) {
    console.error(`Internal error ${err}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAdminById = async (req, res, next) => {
  try {
    // Extract patient ID from request parameters
    const id = req.params.id;

    // SQL query to select patient by ID from the database
    const sqlQuery = `SELECT * FROM admin_table WHERE id = ?`;
    
    // Execute the SQL query with patient ID
    const [result] = await pool.query(sqlQuery, [id]);

    // Check if the result is empty, indicating patient with the given ID doesn't exist
    if (!result.length) {
      return res.status(404).json({
        status: 'error',
        message: `Admin with ID ${id} not found`,
      });
    }

    // Send a success response with the patient data
    res.status(200).json({
      status: 'success',
      data: { result: result },
    });
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error(`Error getting Doctor: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error.message; // Rethrow the error for further handling, if necessary
  }
};



const addNewAdmin = async (req, res, next) => {
  try {
    const { first_name, last_name, password, email } = req.body;

    // Log the received admin data for debugging purposes
    console.log('Request body:', req.body);

    // Hash the password before storing it
    const hashedPassword = hashSync(password, 10);

    // Log the hashed password for debugging purposes
    console.log('Hashed Password:', hashedPassword);

    // Check if file upload succeeded and get the filename
    let imgPath = req.file ? req.file.path : null;

    // Replace backslashes with forward slashes in the file path
    if (imgPath) {
      imgPath = imgPath.replace(/\\/g, '/');
    }

    // Construct the SQL query to insert a new admin
    const insertQuery = `
      INSERT INTO admin_table (role, first_name, last_name, password, email, img, created_at, update_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    // Execute the insert query
    const [insertResult] = await pool.query(insertQuery, ['admin', first_name, last_name, hashedPassword, email, imgPath]);

    // Get the newly inserted admin's ID
    const newAdminId = insertResult.insertId;

    // Construct the SQL query to retrieve the newly inserted admin
    const selectQuery = `
      SELECT id, role, first_name, last_name, email, img, created_at, update_at
      FROM admin_table
      WHERE id = ?
    `;

    // Execute the select query
    const [result] = await pool.query(selectQuery, [newAdminId]);

    // Respond with success message and the newly added admin's data
    res.status(200).json({
      status: 'success',
      message: 'Admin added successfully',
      data: {result:result[0]}
    });
  } catch (error) {
    console.error(`Internal error: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const deleteadmin = async (req, res, next) => {
  try {
    const id = req.params.id; // Access id parameter from request params
    const sqlQuery = `DELETE FROM admin_table WHERE id = ?`;
    const [result] = await pool.query(sqlQuery, [id]); // Use await to handle the query result asynchronously
    res.status(200).json({
      status: 'success',
      message: 'Admin deleted successfully',
      data: { result }
    });
  } catch (error) {
    console.error(`Error deleting admin: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error; // Throw the error object directly
  }
};



const UpdateAdmin = async (req, res, next) => {
  try {
    const id = req.params.id;
    let { first_name, last_name, password, email } = req.body;

    let imgPath = req.file ? req.file.path.replace(/\\/g, '/') : null;

    console.log(`REQ.BODY : ${JSON.stringify(req.body)}`);
    if (req.file) {
      console.log(`Received file: ${req.file.filename}`); // Log the received file
    }

    if (imgPath) {
      console.log(`Image path: ${imgPath}`);
      imgPath = imgPath.replace(/\\/g, '/');
    }

    let sqlQuery = 'UPDATE admin_table SET ';
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

    if (params.length > 0) {
      sqlQuery = sqlQuery.slice(0, -2); // Remove the last comma and space
    } else {
      return res.status(400).json({ error: 'No fields provided for updating' });
    }

    sqlQuery += ', update_at=CURRENT_TIMESTAMP WHERE id = ?';
    params.push(id);

    console.log('Final SQL Query:', sqlQuery);
    console.log('SQL Parameters:', params);

    const [updateResult] = await pool.query(sqlQuery, params);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const [updatedAdmin] = await pool.query('SELECT * FROM admin_table WHERE id = ?', [id]);

    if (!updatedAdmin.length) {
      throw new Error('Admin not found after update');
    }

    console.log('Updated Admin Data:', updatedAdmin[0]);

    res.status(200).json({
      status: 'success',
      data: { result: updatedAdmin[0] },
    });
  } catch (error) {
    console.error(`Error updating admin info: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Function to find a patient by email
const findAdminByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM admin_table WHERE email = ?', [email]);
  return rows[0];
};

// Function to handle user login and generate JWT token
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await findAdminByEmail(email);

    // Log the user found (or not found)
    console.log('User:', user);

    // Check if user exists
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      console.log('Invalid credentials');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If login successful, generate JWT using the secret key
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '2h' });

    // Log the generated token
    console.log('Generated token:', token);

    const userInfo = {
      id: user.id,
      role: user.role,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      created_at: user.creatd_at,
      update_at:user.update_at
    // Include user role in the response
    };

    req.session.userId = user.id;
    console.log('Session userId set:', req.session.userId); // Log the session userId


    // Return the JWT token in the response
    res.status(200).json({ 
      message: 'Adimin logges in Successfully',
      role:'admin',
      user: userInfo,
      sessionId: req.sessionID,
      
      token 



    });
  } catch (error) {
    console.error(`Error logging in: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const deleteAdminImg = async (req, res, next) => {
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

    const sqlQuery = `UPDATE admin_table SET img = NULL WHERE id = ?`;
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


export { getAllAdmins, addNewAdmin, deleteadmin, UpdateAdmin, loginUser,  getAdminById, deleteAdminImg };




