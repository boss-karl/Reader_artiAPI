const express = require("express");
const cors = require('cors');
const RequestLogger = require("./middlewares/logger.js");
const errorHandler = require("./middlewares/error_handler.js");

const UserRoutes = require('./routes/user.routes.js');
const ArticleRoutes = require('./routes/article.route.js');

const app = express();

app.use(express.json());
app.use(cors("*"));
app.use(RequestLogger);
app.use('/api/', ArticleRoutes);
app.use("/api/users/", UserRoutes);
app.use(errorHandler);

module.exports = app;