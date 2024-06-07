import pool from '../database/index.js';

const findAdminByEmail = async (email) => {
    const [rows] = await pool.execute('SELECT * FROM admin_table WHERE email = ?', [email]);
    return rows[0];
  };
  
  const findDoctorByEmail = async (email) => {
    const [rows] = await pool.execute('SELECT * FROM doctors_table WHERE email = ?', [email]);
    return rows[0];
  };
  
  const findPatientByEmail = async (email) => {
    const [rows] = await pool.execute('SELECT * FROM patients_table WHERE email = ?', [email]);
    return rows[0];
  };



  export {findAdminByEmail, findDoctorByEmail, findPatientByEmail}