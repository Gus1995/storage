const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;
app.use(express.static(__dirname));

// Set up Multer storage
const storage = multer.diskStorage({
    destination : function(request, file, callback) {
        callback(null, 'uploads/');
    },
    filename : function(request, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize Multer upload
const upload = multer({storage : storage});

app.get('/login', async (request, response) => {
    const filePath = path.join(__dirname, 'login.html');
    response.sendFile(filePath);
});

app.get('/files', async (request, response) => {
    const filePath = path.join(__dirname, 'files.html');
    response.sendFile(filePath);
});

app.get('/sharing', async (request, response) => {
    const filePath = path.join(__dirname, 'sharing.html');
    response.sendFile(filePath);
});


app.get('/deleted_items', async (request, response) => {
    const filePath = path.join(__dirname, 'deleted_items.html');
    response.sendFile(filePath);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/deleted-list', (req, res) => {
    console.log('GET /images-list called');
    const imagesDir = path.join(__dirname, '/deleted-items');

    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Error reading uploads folder:', err);
            return res.status(500).json({ error: 'Failed to read directory' });
        }

        const images = files.filter(file =>
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );

        console.log('Found images:', images);
        res.json(images);
    });
});




app.get('/images-list', (req, res) => {
    console.log('GET /images-list called');
    const imagesDir = path.join(__dirname, '/uploads');

    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Error reading uploads folder:', err);
            return res.status(500).json({ error: 'Failed to read directory' });
        }

        const images = files.filter(file =>
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );

        console.log('Found images:', images);
        res.json(images);
    });
});

const deletedDir = path.join(__dirname, 'deleted-items');

app.post('/delete-image', express.json(), (req, res) => {
    const { filename } = req.body;

    const originalPath = path.join(__dirname, 'uploads', filename);
    const targetPath = path.join(deletedDir, filename);

    fs.rename(originalPath, targetPath, (err) => {
        if (err) {
            console.error('Error moving file:', err);
            return res.status(500).json({ error: 'Failed to move file' });
        }
        res.json({ success: true, message: `${filename} moved to deleted-items` });
    });
});


app.get('/upload', async (request, response) => {
    response.sendFile(__dirname + '/upload.html');
});

app.post('/upload', upload.single('file'), (request, response) => {
    response.json({ filename : request.file.filename });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
