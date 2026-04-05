require('dotenv').config();
const express = require("express");
const cors = require('cors');
const connectDB = require('./database/connectDB');
const RequestLogger = require("./middlewares/logger.js");
const errorHandler = require("./middlewares/error_handler.js");
const ArticleRoutes = require('./routes/article.route.js');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cors("*"));
app.use(RequestLogger);
app.use('/api', ArticleRoutes);
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server is listening on Port ${PORT}`);
})