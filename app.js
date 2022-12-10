// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "todoapp";

app.locals.appTitle = `${capitalized(projectName)} created with RootLauncher123`;
app.locals.loggedIn = false;

const session = require("express-session");
const MongoStore = require("connect-mongo");

app.use(
  session({
    secret: "keyboard cat",
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified,
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/todoapp",
      ttl: 14 * 24 * 60 * 60, // = 14 days. Default
    }),
  })
);

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
