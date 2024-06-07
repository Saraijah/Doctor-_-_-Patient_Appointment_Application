import pool from '../database/index.js';



const getAllDepartments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const offset = (page - 1) * limit;

    let sqlQuery = 'SELECT * FROM departments_table LIMIT ?, ?';
    console.log('SQL Query:', sqlQuery); // Log SQL query
    const [department] = await pool.query(sqlQuery, [offset, limit]);
    
    const totalCountQuery = 'SELECT COUNT(*) AS total FROM departments_table';
    const [totalCountRows] = await pool.query(totalCountQuery);
    const totalRecords = totalCountRows[0].total;

    const jsonResponse = {
      status: 'success',
      result: department.length,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      data: {
        department: department 
      },
      totalItems: totalRecords
    };

    console.log('JSON Response:', JSON.stringify(jsonResponse, null, 2)); // Log JSON response with proper formatting

    res.status(200).json(jsonResponse); // Send jsonResponse directly
  } catch (err) {
    console.error(`Internal error ${err}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const { department_name } = req.body;

    // SQL query to insert a new department
    const insertQuery = `
      INSERT INTO departments_table (department_name)
      VALUES (?)
    `;

    // Execute the insert query
    const [insertResult] = await pool.query(insertQuery, [department_name]);

    // Get the ID of the newly inserted department
    const newDepartmentId = insertResult.insertId;

    // SQL query to retrieve the newly inserted department
    const selectQuery = `
      SELECT * FROM departments_table WHERE id = ?
    `;

    // Execute the select query
    const [rows] = await pool.query(selectQuery, [newDepartmentId]);

    // Send the response with the newly inserted department data
    res.status(200).json({
      status: 'success',
      message: 'Department added successfully',
      data: rows[0] // assuming 'rows' contains an array of results and we're interested in the first item
    });
  } catch (error) {
    console.error(`Internal error: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
    next(error);
  }
};




const getDepartmentById = async (req, res, next) => {
    try {
      const id = req.params.id; // Access id parameter from request params
      const sqlQuery = `SELECT * FROM departments_table WHERE id = ?`;
      const [result] = await pool.query(sqlQuery, [id]); // Use await to handle the query result asynchronously
      res.status(200).json({
        status: 'success',
        message: 'Department deleted successfully',
        data: { result }
      });
    } catch (error) {
      console.error(`Error deleting depertment: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
      throw error; // Throw the error object directly
    }
  };

const deleteDepartmentById = async (req, res, next) => {
  try {
    const id = req.params.id; // Access id parameter from request params
    const sqlQuery = `DELETE FROM departments_table WHERE id = ?`;
    const [result] = await pool.query(sqlQuery, [id]); // Use await to handle the query result asynchronously
    res.status(200).json({
      status: 'success',
      message: 'Department deleted successfully',
      data: { result }
    });
  } catch (error) {
    console.error(`Error deleting depertment: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error; // Throw the error object directly
  }
};


const UpdateDepartmentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { department_name} = req.body;
    const sqlQuery = `
      UPDATE departments_table 
      SET department_name=?
      WHERE id=?
    `;
    const [result] = await pool.query(sqlQuery, [department_name, id]);

    // If no rows were affected by the update, it means the admin with the given ID wasn't found
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: `department with ID ${id} not found`,
      });
    }

    // Send a success response with updated admin information
    res.status(200).json({
      status: 'success',
      message: `Department with ID ${id} updated successfully`,
      data: { result: result },
    });
  } catch (error) {
    console.error(`Error updating admin: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error;
  }
};


const getDoctorByDepartments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 20) || 5;
    const offset = (page - 1) * limit;

    const departmentId = req.params.departmentId;

    // Query to get the doctors with pagination
    const sqlQuery = `
      SELECT doctors_table.*
      FROM doctors_table
      WHERE doctors_table.department_id = ?
      LIMIT ?, ?
    `;
    console.log('SQL Query:', sqlQuery); // Log SQL query
    const [doctors] = await pool.query(sqlQuery, [departmentId, offset, limit]);

    // Query to get the total count of doctors in the department
    const totalCountQuery = `
      SELECT COUNT(*) AS total
      FROM doctors_table
      WHERE doctors_table.department_id = ?
    `;
    const [totalCountRows] = await pool.query(totalCountQuery, [departmentId]);
    const totalRecords = totalCountRows[0].total;

    res.status(200).json({
      status: 'success',
      result: doctors.length,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      data: { doctors },
      totalItems: totalRecords,
    });

  } catch (error) {
    console.error(`Internal error ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error;
  }
};



const searchDoctorByDepartment = async (req, res, next) => {
  try {
    const { departmentId } = req.params; // Extract department ID from route parameters
    const { searchTerm } = req.body; // Extract search term from request body

    const sqlQuery = `SELECT * FROM doctors_table WHERE (first_name LIKE ? OR last_name LIKE ?) AND department_id = ?`;
    const [result] = await pool.query(sqlQuery, [`%${searchTerm}%`, `%${searchTerm}%`, departmentId]);

    res.status(200).json({
      result: result.length,
      status: 'success',
      data: { result:result }


    });
  } catch (error) {
    console.error(`Internal Error: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
    next(error); // Call next with error to handle it properly
  }
};

const countAllDepartments = async (req, res, next) => {
  try {
    const sqlQuery = `SELECT COUNT(*) AS count FROM departments_table`;
    const [result] = await pool.query(sqlQuery); // Await the query

    res.status(200).json({
      status: "Success",
      message: "Total count of departments was successful",
      data: {
        result: result[0] // Access the first element which contains the count
      }
    });
  } catch (error) {
    console.error(`Internal Error: ${error.message}`);
    res.status(500).json({ error: 'Error getting all Departments' });
  }
};




export { UpdateDepartmentById, deleteDepartmentById, getDepartmentById, createDepartment,  getAllDepartments,
  getDoctorByDepartments,  searchDoctorByDepartment, countAllDepartments
};
