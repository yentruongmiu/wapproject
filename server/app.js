const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/product');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(productRoutes);


app.listen(port, () => console.log(`Server is running on port ${port}`));