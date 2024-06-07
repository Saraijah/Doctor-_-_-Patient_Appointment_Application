import pool from '../database/index.js';


const getAllWebsiteSettings  = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 5;
      const offset = (page - 1) * limit;
  
      let sqlQuery = 'SELECT * FROM website_setting_table LIMIT ?, ?';
      console.log('SQL Query:', sqlQuery); // Log SQL query
      const [websitesettings] = await pool.query(sqlQuery, [offset, limit]);
      
      const totalCountQuery = 'SELECT COUNT(*) AS total FROM website_setting_table';
      const [totalCountRows] = await pool.query(totalCountQuery);
      const totalRecords = totalCountRows[0].total;
  
      const jsonResponse = {
        status: 'success',
        result: websitesettings.length,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        data:websitesettings,
        totalItems: totalRecords
      };

      
  
      console.log('JSON Response:', JSON.stringify(jsonResponse, null, 2)); // Log JSON response with proper formatting
      res.status(200).json({
        status: 'success',
        data: { result:websitesettings },
        result: websitesettings.length,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        data: websitesettings,
        totalItems: totalRecords
      });
    } catch (err) {
      console.error(`Error retrieving Settings: ${err}`); // Log the error message
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

 
  const createWebsiteSettings = async (req, res, next) => {
    try {
        // Destructure the request body
        const { email_1, email_2, phone_number_1, phone_number_2, app_name, website_settings, fax, location} = req.body;

        // Insert the website settings into the database
        const sqlQuery = `
            INSERT INTO website_setting_table (email_1, email_2, phone_number_1, phone_number_2, app_name, website_settings, fax, location)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        // Execute the SQL query with the provided data
        const result = await pool.query(sqlQuery, [email_1, email_2, phone_number_1, phone_number_2, app_name, website_settings, fax,  location]);

        // Send success response with inserted data
        res.status(200).json({
            status: 'success',
            message: 'Setting created successfully',
            data: result
        });
    } catch (error) {
        // Handle errors
        console.error(`Error creating settings: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



  //deleting settings

  const deleteWebsiteSettingsById  = async (req, res, next) => {
    try {
      const id = req.params.id;
      const sqlQuery = `DELETE FROM website_setting_table WHERE id = ?`;
      const [result] = await pool.query(sqlQuery, [id]);
      res.status(200).json({
        status: 'success',
        data: { result:result }
      });
    } catch (error) {
      console.error(`Error deleting setting: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
      throw error.message;
    }
  };


  const getWebsiteSettingsById = async (req, res, next) => {
    try {
        // Extract setting ID from request parameters
        const id = req.params.id;
        console.log(`Id for Website Settings ${id}`)

        // SQL query to select setting by ID from the database
        const sqlQuery = `SELECT * FROM website_setting_table WHERE id = ?`;

        // Execute the SQL query with setting ID
        const [result] = await pool.query(sqlQuery, [id]);

        // Check if the result is empty, indicating setting with the given ID doesn't exist
        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Setting with ID ${id} not found`,
            });
        }

        // Send a success response with the setting data
        res.status(200).json({
            status: 'success',
            data: {result:result[0]},
        });
    } catch (error) {
        // Handle any errors that occur during the database operation
        console.error(`Error retrieving settings: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
        // No need to rethrow the error here, as it's already handled
    }
};


const updateTimeWebsiteSettingsById = async (req, res, next) => {
  try {
    // Extract website settings information from request body
    const {
      email_1,
      email_2,
      phone_number_1,
      phone_number_2,
      app_name,
      website_settings,
      fax,
      location
    } = req.body;

    // SQL query to update website settings in the database
    const sqlQuery = `
      UPDATE website_setting_table 
      SET email_1 = ?, email_2 = ?, phone_number_1 = ?, phone_number_2 = ?, 
          app_name = ?, website_settings = ?, fax = ?, location = ? 
      WHERE id = 1`; // Assuming the ID is always 1

    // Execute the SQL query with website settings information
    const [result] = await pool.query(sqlQuery, [
      email_1,
      email_2,
      phone_number_1,
      phone_number_2,
      app_name,
      website_settings,
      fax,
      location
    ]);

    // If no rows were affected by the update, it means the settings with the given ID weren't found
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Cannot update settings with ID 1 not found`,
      });
    }

    // Send a success response with the update result
    res.status(200).json({
      status: 'success',
      data: {
        result: result,
      },
    });
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error(`Error updating settings info: ${error.message}`);
    res.status(500).json({
      error: 'Internal server error',
    });
    throw error; // Rethrow the error for further handling, if necessary
  }
};



export {updateTimeWebsiteSettingsById, getWebsiteSettingsById, deleteWebsiteSettingsById, createWebsiteSettings, getAllWebsiteSettings }

