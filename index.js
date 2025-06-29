const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const app = express();

//Middleware
app.use(express.json());
app.use(cors()); 
app.use(helmet()); 

//Define Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/transactions', require('./src/routes/transaction.routes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));