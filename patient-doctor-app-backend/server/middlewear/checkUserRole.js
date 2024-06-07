// patientMiddleware.js

// Middleware function to check if the user is a patient
const checkPatientRole = (req, res, next) => {
    // Assuming the user's role is included in the decoded token
    const userRole = req.user.role;

    // Check if the user is a patient
    if (userRole === 'patient') {
        // If the user is a patient, allow access to the next middleware or route handler
        next();
    } else {
        // If the user is not authorized, send a 403 Forbidden response
        return res.status(403).json({ error: 'Access forbidden' });
    }
};

// doctorMiddleware.js

// Middleware function to check if the user is a doctor
const checkDoctorRole = (req, res, next) => {
    // Assuming the user's role is included in the decoded token
    const userRole = req.user.role;

    // Check if the user is a doctor
    if (userRole === 'doctor') {
        // If the user is a doctor, allow access to the next middleware or route handler
        next();
    } else {
        // If the user is not authorized, send a 403 Forbidden response
        return res.status(403).json({ error: 'Access forbidden' });
    }
};


const checkAdminRole = (req, res, next) => {
    // Assuming the user's role is included in the decoded token
    const userRole = req.user.role;

    // Check if the user is an admin
    if (userRole === 'admin') {
        // If the user is an admin, allow access to the next middleware or route handler
        next();
    } else {
        // If the user is not authorized, send a 403 Forbidden response
        return res.status(403).json({ error: 'Access forbidden' });
    }
};


export {checkAdminRole, checkPatientRole, checkDoctorRole}


// patientMiddleware.js

