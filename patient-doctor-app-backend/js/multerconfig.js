import multer from 'multer';

// Define storage configuration for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename for the uploaded file
    }
});

// Configure multer to use the storage configuration
const upload = multer({ storage:storage });



export default upload;
