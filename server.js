const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
// routes
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");

// app
const app = express();

// database
const adminPassword = encodeURIComponent(process.env.PASSWORD);

mongoose
    .connect(
        `mongodb+srv://ademustexcel:${adminPassword}@myseoblog.2j6wv.mongodb.net/?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
        }
    )
    .then(() => {
        console.log("Database connected!!!");
    });

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

// cors
if (process.env.NODE_ENV === "development") {
    app.use(
        cors({
            origin: `${process.env.CLIENT_URL}`,
        })
    );
}

// routes
// app.get("/api", (req, res) => {
//     res.json({
//         time: Date().toString(),
//     });
// });

// routes middleware
app.use("/api", blogRoutes);
app.use("/api", authRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
