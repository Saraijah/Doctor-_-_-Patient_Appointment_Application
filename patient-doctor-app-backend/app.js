import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
//routers
import session from 'express-session';
import cookieParser from 'cookie-parser';
import adminRouter from './server/routes/adminRoutes.js';
import patientRouter from './server/routes/patientRoutes.js';
import doctorRouter from './server/routes/doctorRoutes.js';
import departmentRouter from './server/routes/departmentsRoutes.js';
import scheduleRouter from './server/routes/scheduleRoutes.js';
import timeSlotRouter from './server/routes/timeSlotRoutes.js';
import appointmentRouter from './server/routes/appointmentRoutes.js';
import websiteSettingsRouter from './server/routes/websiteSettingRoutes.js';
import authPatientRouter from './server/routes/authRoutes.js';
import authAdminRouter from './server/routes/adminAuthRoutes.js';
import authDoctorRouter from './server/routes/doctorAuthRoutes.js';
import paymentRouter from './server/routes/paymentRoutes.js';
import verifyToken from './server/middlewear/verifyToken.js';
import { checkAdminRole, checkDoctorRole, checkPatientRole } from './server/middlewear/checkUserRole.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';


dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


//setting up middleware for public folder
app.use(express.static('public'));

//setting mutler
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // File naming convention
    }
});

const upload = multer({ storage: storage });

app.use(session({
    secret:'!45jhkl45l$54600kl?',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

//setting up cookie parser middleware 
app.use(cookieParser());

app.options('*', cors(['http://localhost:4200']));
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));


app.use('/uploads', express.static('uploads'));

// Body parsing
app.use(express.json({ limit: '5kb' }));
app.use(express.urlencoded({ extended: true, limit: '5kb' }));

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Route Specification
app.use('/api/v1/careconnect/services/admins', adminRouter);//done
app.use('/api/v1/careconnect/services/patients', patientRouter);//done
app.use('/api/v1/careconnect/services/doctors', doctorRouter);//not uding
app.use('/api/v1/careconnect/services/departments', departmentRouter); //DONE
app.use('/api/v1/careconnect/services', scheduleRouter);//done
app.use('/api/v1/careconnect/services/timeslots', timeSlotRouter);//DONE
app.use('/api/v1/careconnect/services/appointments', appointmentRouter);//done
app.use('/api/v1/careconnect/services/settings', websiteSettingsRouter);
app.use('/api/v1/careconnect/services/payments', paymentRouter);//done

// Add the verifyToken middleware to the login routes
app.use('/api/v1/careconnect/services/login/patients', authPatientRouter);//done
app.use('/api/v1/careconnect/services/login/admin', authAdminRouter);//done
app.use('/api/v1/careconnect/services/login/doctor', authDoctorRouter);//not usinf


// Start the server
const port = process.env.PORT || 5660;
const server = app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
