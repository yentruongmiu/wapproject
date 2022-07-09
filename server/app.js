const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/product');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use(productRoutes);


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