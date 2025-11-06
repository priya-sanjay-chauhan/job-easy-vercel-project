const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = require("./App");

const path = require("path");

// DB Connection
const DBConnectionHandler = require("./Utils/DBconnect");
DBConnectionHandler();

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Job Hunter Server is running!");
});

// app.use(express.static(path.join(__dirname, "client/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });

// 404 Error handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Error Handeling Middleware(default synchronous error handling middleware from express)
app.use((err, req, res, next) => {
  if (res.headersSent) {
    next("There was a problem");
  } else {
    if (err.message) {
      res.status(err.status || 500).send(err.message);
    } else {
      res.status(500).send("Something went wrong");
    }
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
