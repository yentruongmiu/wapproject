const express = require('express');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');

const auth = require('./auth');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public', 'assets', 'images')));

app.use(userRoutes);
app.use(auth, productRoutes);
app.use(auth, cartRoutes);
app.use(auth, orderRoutes);


app.use((req, res, next) => {
    res.status(404).json({ error: req.url + ' API not supported!' });
});

app.use((err, req, res, next) => {
    if (err.message === 'Not Found') {
        res.status(404).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Something is wrong! Try later!' });
    }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));