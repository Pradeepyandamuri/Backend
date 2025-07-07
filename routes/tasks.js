const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Get all tasks (created by or assigned to current user)
router.get("/", authMiddleware, async (req, res) => {
  const userEmail = req.user.email;
  try {
    const result = await db.query(
      "SELECT * FROM tasks WHERE user_email = $1 OR assigned_to_email = $1 ORDER BY id DESC",
      [userEmail]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create new task (with optional assignment)
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, due_date, priority, assigned_to_email } = req.body;
  const userId = req.user.id;
  const userEmail = req.user.email;

  try {
    const result = await db.query(
      `INSERT INTO tasks (
        title, description, due_date, priority, status, reminded,
        user_id, user_email, assigned_to_email
      ) VALUES ($1, $2, $3, $4, 'pending', false, $5, $6, $7) RETURNING *`,
      [
        title,
        description,
        due_date,
        priority,
        userId,
        userEmail,
        assigned_to_email || null,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update a task (only by creator)
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, priority, status, assigned_to_email } = req.body;
  const userEmail = req.user.email;

  try {
    const result = await db.query(
      `UPDATE tasks SET
        title = $1,
        description = $2,
        due_date = $3,
        priority = $4,
        status = $5,
        assigned_to_email = $6
      WHERE id = $7 AND user_email = $8
      RETURNING *`,
      [
        title,
        description,
        due_date,
        priority,
        status || "pending",
        assigned_to_email || null,
        id,
        userEmail,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a task (only by creator)
router.delete("/:id", authMiddleware, async (req, res) => {
  const taskId = req.params.id;
  const userEmail = req.user.email;

  try {
    await db.query("DELETE FROM tasks WHERE id = $1 AND user_email = $2", [
      taskId,
      userEmail,
    ]);
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get dependencies for a task
router.get("/:id/dependencies", authMiddleware, async (req, res) => {
  const taskId = req.params.id;
  try {
    const result = await db.query(
      `SELECT d.depends_on_task_id, t.title, t.status
       FROM task_dependencies d
       JOIN tasks t ON d.depends_on_task_id = t.id
       WHERE d.task_id = $1`,
      [taskId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a dependency (task B depends on task A)
router.post("/:id/dependencies", authMiddleware, async (req, res) => {
  const taskId = req.params.id;
  const { depends_on_task_id } = req.body;

  try {
    await db.query(
      "INSERT INTO task_dependencies (task_id, depends_on_task_id) VALUES ($1, $2)",
      [taskId, depends_on_task_id]
    );
    res.status(201).json({ message: "Dependency added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
