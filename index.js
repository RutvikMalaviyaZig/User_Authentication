require("dotenv").config();
// core modules
const {express} = require('./Provider')
const path = require('path')

// routes imports
const apiRoutes = require("./api/routes/index");
const pageRoutes = require("./api/routes/pageRoute");

// import sequize database
const sequelize = require("./config/database");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));


// cors setup
app.use(
  cors({
    origin: "*",
  })
);
// test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

// routes
app.use("/api/v1", apiRoutes);
app.use("/page", pageRoutes);

app.listen(PORT, (req, res) => {
  console.log(`server is listening at http://localhost:${PORT}`);
});
