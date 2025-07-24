const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const whatsappRoutes = require('./routes/whatsapp');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Routes
app.use('/', whatsappRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
