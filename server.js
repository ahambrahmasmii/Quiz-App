const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// Database Connection
const sequelize = new Sequelize("task_management", "root", "Vasuki@02", {
  host: "localhost",
  dialect: "mysql",
});

// Test Database Connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Unable to connect to the database:", err));

// Models
const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    username: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
  },
  { tableName: "Users", timestamps: false } // Map to existing table
);

const Task = sequelize.define(
  "Task",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    user_id: { type: DataTypes.INTEGER },
    title: { type: DataTypes.STRING },
    start_time: { type: DataTypes.DATE },
    end_time: { type: DataTypes.DATE },
    priority: { type: DataTypes.INTEGER },
    status: { type: DataTypes.ENUM("pending", "finished") },
  },
  { tableName: "Tasks", timestamps: false } // Map to existing table
);

// Relationships
User.hasMany(Task, { foreignKey: "user_id" });
Task.belongsTo(User, { foreignKey: "user_id" });

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

// Routes
// User Registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.create({ username, password });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: "User registration failed", details: error });
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username, password } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username }, "secretkey", { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", id, token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error });
  }
});

// Create Task
app.post("/tasks", authenticateToken, async (req, res) => {
  const { title, start_time, end_time, priority, status } = req.body;

  try {
    const task = await Task.create({ user_id: req.user.id, title, start_time, end_time, priority, status });
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(400).json({ error: "Task creation failed", details: error });
  }
});

// Dashboard Statistics
app.get("/dashboard/statistics", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Total count of tasks
    const totalTasks = await sequelize.query(
      `SELECT COUNT(*) AS total FROM Tasks WHERE user_id = ?;`,
      { replacements: [userId], type: Sequelize.QueryTypes.SELECT }
    );

    // Percent of completed and pending tasks
    const completedPercent = await sequelize.query(
      `SELECT COUNT(*) * 100 / (SELECT COUNT(*) FROM Tasks WHERE user_id = ?) AS completed_percentage 
       FROM Tasks WHERE user_id = ? AND status = 'finished';`,
      { replacements: [userId, userId], type: Sequelize.QueryTypes.SELECT }
    );

    const pendingPercent = await sequelize.query(
      `SELECT COUNT(*) * 100 / (SELECT COUNT(*) FROM Tasks WHERE user_id = ?) AS pending_percentage 
       FROM Tasks WHERE user_id = ? AND status = 'pending';`,
      { replacements: [userId, userId], type: Sequelize.QueryTypes.SELECT }
    );

    // Time lapsed and balance estimated time
    const timeLapsed = await sequelize.query(
      `SELECT priority, SUM(TIMESTAMPDIFF(HOUR, start_time, NOW())) AS time_lapsed
       FROM Tasks WHERE user_id = ? AND status = 'pending' GROUP BY priority;`,
      { replacements: [userId], type: Sequelize.QueryTypes.SELECT }
    );

    const balanceTime = await sequelize.query(
      `SELECT priority, SUM(GREATEST(0, TIMESTAMPDIFF(HOUR, NOW(), end_time))) AS balance_time
       FROM Tasks WHERE user_id = ? AND status = 'pending' GROUP BY priority;`,
      { replacements: [userId], type: Sequelize.QueryTypes.SELECT }
    );

    // Average time for task completion
    const avgCompletionTime = await sequelize.query(
      `SELECT AVG(TIMESTAMPDIFF(HOUR, start_time, end_time)) AS avg_completion_time 
       FROM Tasks WHERE user_id = ? AND status = 'finished';`,
      { replacements: [userId], type: Sequelize.QueryTypes.SELECT }
    );

    res.status(200).json({
      totalTasks: totalTasks[0]?.total || 0,
      completedPercentage: completedPercent[0]?.completed_percentage || 0,
      pendingPercentage: pendingPercent[0]?.pending_percentage || 0,
      timeLapsed,
      balanceTime,
      avgCompletionTime: avgCompletionTime[0]?.avg_completion_time || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
