require("dotenv").config();
const express = require("express");
const path = require("path");
const rootRouter = require("./routes/root");
const notFoundController = require("./controller/notFound");
const {loggerMiddleware, logEvents} = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const corsOptions = require("./utils/corsOption");
const cors = require("cors");
const sequelize = require("./utils/dbConnection");
const userRouter = require("./routes/userRoutes")


const app = express();

const PORT = process.env.PORT || 5000;



app.use(loggerMiddleware);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());


// * serving static files through a built-in express.sattic middleware (eg. -Landing html page, CSS files, etc). All req. can access the public directory.
// ! Giving it a "/" path means the public folder is accessible by all n/w req
// ! Giving it a defined path "/images" means only the req. that starts with "/images" will be able to acess the public folder
app.use("/", express.static(path.join(__dirname, "public")));


// * rootRouter
app.use("/", rootRouter);
app.use("/user", userRouter);


// * Handling resources that doesn't exist
// ! Should be at the very end of all routes & middlewares
app.all("*", notFoundController);


// ! Error handling middleware should be just before we start the server
// ! Any error that we throw -> throw new Error("some message") inside sync code || forward the error using next -> next(error) inside async code, the error reaches this middleware directly.
// * This prevents the app from being crashed (we can't always restart the server once deployed)
app.use(errorHandler);


sequelize.authenticate()
  .then(() => {
    app.listen(PORT);
    console.log('Connection with DB has been established successfully');
    console.log(`The server started at ${PORT}`);
  })
  .catch((err) => {
    console.error('Unable to connect to the database & start the server:', err);
    logEvents(`${err.name}: ${err.message}`, "SQLServerLog.log");
  })