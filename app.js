const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
//host: 'localhost',
//user: 'root',
//password: '',
//database: 'c237_marketapp'
host: 'db4free.net',
user: 'chelyn',
password: 'Xicheng1',
database: 'c237_marketapp'
});

//Good Morning Class !!


// set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

connection.connect((err) => {
if (err) {
console.error('Error connecting to MySQL:', err);
return;
}
console.log('Connected to MySQL database');
});

//toFixed is used to round the price to 2 decimal places
// Set up view engine
app.set('view engine', 'ejs');

// enable static files
app.use(express.static('public'));

// enable form processing
app.use(express.urlencoded({
    extended: false
}));

// enable static files
app.use(express.static('public'));

// Define routes
 app.get('/', (req, res) => {
    const sql = 'SELECT * FROM products';
    connection.query(sql, (error, results) => {
    if (error) {
    console.error('Database query error:', error.message);
    return res.status(500).send('Error Retrieving products');
    };
    res.render('index', { products:results }); 
    // Results is an array of products, results is the record retrieved from the database table
    // Render HTML page with data
    });
    });
    
// Define routes for product details page
    app.get('/product/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE productId = ?';
    // Fetch data from MySQL based on the product ID
    connection.query(sql, [productId], (error, results) => {
    if (error) {
    console.error('Database query error:', error.message);
    return res.status(500).send('Error Retrieving product by ID');
    }
    // Check if any product with the given ID was found
    if (results.length > 0) {
        // Render HTML page with the product data
    res.render('product', { product:results[0] });
    } 
    else {
        // If no product with the given ID was found, render a 404 page or handle it accordingly
        res.status(404).send('Product not found');
    }
    });
});

// Define routes for adding new products
app.get('/addProduct', (req, res) => {
    // res.send('Add Product Page');
    res.render('addProduct');
});

app.post('/addProduct', upload.single("image"), (req, res) => {
    // Extract product data from the request body
    // always need to add enctype = "multipart/form-data" in the form tag in the ejs file so that the image can be uploaded
    const {name, quantity, price,} = req.body;
    let image; // will store the image name
    if(req.file) {
        image = req.file.filename; // save only the filename
    } else {
        image = null;

    }
    const sql = 'INSERT INTO products (productName, quantity, price, image) VALUES (?, ?, ?, ?)';
    // Insert the new product into the database
    connection.query(sql, [name, quantity, price, image], (error, results) => {
    if (error) {
        // Handle any error that occurs during the database operation
    console.error('Error adding product', error);
    res.status(500).send('Error adding product');
    }
    // Check if any product with the given ID was found
    else {
        // Send a success response
        res.redirect('/');
    }
    });
});

// Define routes for adding new Feedback
app.get('/addFeedback', (req, res) => {
    // res.send('Add Feedback Page');
    res.render('addFeedback');
});

app.post('/addFeedback', (req, res) => {
    const {issue, feedback} = req.body;
        // Send a success response
        res.redirect('/');
    });

    // Define routes for adding new Feedback
app.get('/addUser', (req, res) => {
    // res.send('Add Feedback Page');
    res.render('addUser');
});

app.post('/addUser', (req, res) => {
    const {name, contact, dob, password} = req.body;
        // Send a success response
        res.redirect('/');
    });

    // Define routes for adding new Feedback
app.get('/Userlogin', (req, res) => {
    // res.send('Add Feedback Page');
    res.render('Userlogin');
});

app.post('/Userlogin', (req, res) => {
    const {name, password} = req.body;
        // Send a success response
        res.redirect('/');
    });

app.get('/editProduct/:id', (req, res) => {
    // Extract product data from the request body
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE productId = ?';
    // Insert the new product into the database
    connection.query(sql, [productId], (error, results) => {
    if (error) {
        // Handle any error that occurs during the database operation
    console.error('Database query error', error.message);
    return res.status(500).send('Error retrieving product by ID');
    }
    if (results.length > 0) {
        // Render HTML page with the product data
    res.render('editProduct', { product:results[0] });
    }
    // Check if any product with the given ID was found
    else {
        // Send a success response
        res.status(404).send('Product not found');
    }
    });
});

app.post('/editProduct/:id', upload.single('image'), (req, res) => {
    // Extract product data from the request body
    const productId = req.params.id;
    let image = req.body.currentImage; // Retrieve the current image filename
    if(req.file) { // If new image is uploaded
        image = req.file.filename; // Set image to be new image filename
    }
    const {name, quantity, price, } = req.body;
    const sql = 'UPDATE products SET productname = ?, quantity = ?, price = ?, image = ? WHERE productId = ?';
    // Insert the new product into the database
    connection.query(sql, [name, quantity, price, image, productId], (error, results) => {
    if (error) {
        // Handle any error that occurs during the database operation
    console.error('Error updating product', error);
    res.status(500).send('Error updating product');
    }
    // Check if any product with the given ID was found
    else {
        // Send a success response
        res.redirect('/');
    }
    });
});

app.get('/deleteProduct/:id', (req, res) => {
    // Extract product data from the request body
    const productId = req.params.id;
    const sql = 'DELETE FROM products WHERE productId = ?';
    // Insert the new product into the database
    connection.query(sql, [productId], (error, results) => {
    if (error) {
        // Handle any error that occurs during the database operation
    console.error('Error deleting product', error);
    res.status(500).send('Error deleting product');
    }
    // Check if any product with the given ID was found
    else {
        // Send a success response
        res.redirect('/');
    }
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));