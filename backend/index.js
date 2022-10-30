const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/AuthRoutes")
const session = require("express-session")
//require database connection on loading server
require("./databases/mongodb");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());



const { SERVER_PORT,SESSION_SECRET } = process.env;

const origin = ["http://localhost:3000"];
const methods = ["GET", "POST", "PUT", "DELETE"];

app.use(
  cors({
    origin: origin,
    methods: methods,
    credentials: true,
  })
);
app.use(session({
  secret: SESSION_SECRET,
  resave: true,
  cookie: {maxAge: 1 * 24 * 60 * 60},
  saveUninitialized: false,
  unset: 'destroy'
}))




app.use("/", authRoutes)

app.listen(SERVER_PORT, () => {
  console.log(`SERVER LISTENING @ PORT ${SERVER_PORT}`);
});
