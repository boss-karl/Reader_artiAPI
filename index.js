require('dotenv').config();
require('./src/config/envValidator.js');
const app = require("./src/app.js");
const connectDB = require('./src/config/connectDB.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async ()=>{
    await connectDB();
    console.log(`Server is listening on Port ${PORT}`);
})