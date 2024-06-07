import multer  from "multer";

const upload = multer({ dest: 'uploads/' }); // Define upload destination

// POST route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
    // Access the uploaded file from req.file
    const uploadedFile = req.file;

    // Check if file exists
    if (!uploadedFile) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Process the uploaded file (e.g., save to database, resize, etc.)

    // Send response
    res.status(200).json({ message: 'File uploaded successfully', filename: uploadedFile.filename });
});
