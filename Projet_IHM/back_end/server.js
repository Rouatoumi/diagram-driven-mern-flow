require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');
const cors  = require( "cors");
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const bidRoutes = require('./routes/bidRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const app = express();
const port = 3000;

// Middleware pour lire JSON
app.use(express.json());
app.use(cors());
app.use(cors({
    origin: 'http://localhost:8070'
  }));
   // This must be at the very top
console.log('JWT Secret:', process.env.JWT_SECRET); // Verify it loads
// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/Bidding', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error(err));

// Utiliser les routes
app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', subCategoryRoutes);
app.use('/api', bidRoutes);
app.use('/api', authRoutes);
app.use('/uploads', express.static('uploads'));

app.use('/api', uploadRoutes);
// Démarrer serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
