const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const moment = require("moment-timezone");
const verifyJwtToken = require("../middlewares/authMiddleware");

// Endpoint for creating a new task
router.post("/create", verifyJwtToken, async (req, res) => {
  try {
    const { title, priority, checklist, dueDate, status } = req.body;

    if (!title || !priority || !checklist) {
      return res.status(400).json({
        message: "Bad Request: Missing required fields",
        success: false,
      });
    }

    const task = new Task({
      title,
      priority,
      checklist,
      dueDate,
      status,
      refUserId: req.body.userId,
    });

    await task.save();
    res.json({
      message: "Task created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

// Endpoint for fetching tasks with filters
router.get("/all", verifyJwtToken, async (req, res) => {
  try {
    const userId = req.body.userId;
    const today = moment().tz("Asia/Kolkata");

    let filter = {};
    const typeOfFilter = req.query.typeOfFilter || "thisWeek";

    switch (typeOfFilter) {
      case "today":
        filter = {
          createdAt: {
            $gte: moment(today).startOf("day").toDate(),
            $lt: today.toDate(),
          },
        };
        break;

      case "thisWeek":
        filter = {
          createdAt: {
            $gte: moment(today).subtract(7, "days").startOf("day").toDate(),
            $lt: today.toDate(),
          },
        };
        break;

      case "thisMonth":
        filter = {
          createdAt: {
            $gte: moment(today).subtract(30, "days").startOf("day").toDate(),
            $lt: today.toDate(),
          },
        };
        break;

      default:
        break;
    }

    const tasks = await Task.find({ refUserId: userId, ...filter });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

// Endpoint for updating task details
router.put("/edit/:taskId", verifyJwtToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, priority, checklist, status, dueDate } = req.body;

    if (!taskId || !title || !priority || !checklist || !status) {
      return res.status(400).json({
        message: "Bad Request: Missing required fields",
        success: false,
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, priority, checklist, status, dueDate },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    res.json({
      message: "Task updated successfully",
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

// Endpoint for updating task status
router.put("/:taskId/move", verifyJwtToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    res.json({
      message: "Task status updated successfully",
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

// Endpoint for fetching task details by taskId
router.get("/task-description/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task details:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

// Endpoint for deleting a task by taskId
router.delete("/delete-task/:taskId", verifyJwtToken, async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    res.json({
      message: "Task deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

// Endpoint for fetching task analytics
router.get("/analytics", verifyJwtToken, async (req, res) => {
  try {
    const { userId } = req.body;

    const analytics = {
      backlogCount: await Task.countDocuments({
        refUserId: userId,
        status: "backlog",
      }),
      todoCount: await Task.countDocuments({
        refUserId: userId,
        status: "todo",
      }),
      progressCount: await Task.countDocuments({
        refUserId: userId,
        status: "progress",
      }),
      completedCount: await Task.countDocuments({
        refUserId: userId,
        status: "done",
      }),
      lowPriorityCount: await Task.countDocuments({
        refUserId: userId,
        "priority.typeOfPriority": "low",
        status: { $ne: "done" },
      }),
      moderatePriorityCount: await Task.countDocuments({
        refUserId: userId,
        "priority.typeOfPriority": "medium",
        status: { $ne: "done" },
      }),
      highPriorityCount: await Task.countDocuments({
        refUserId: userId,
        "priority.typeOfPriority": "high",
        status: { $ne: "done" },
      }),
      dueDateNotDoneCount: await Task.countDocuments({
        refUserId: userId,
        status: { $ne: "done" },
        dueDate: { $exists: true },
      }),
    };

    res.json({
      data: analytics,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching task analytics:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

// Endpoint for updating checklist item status
router.put("/checklist/:taskId/:itemId", verifyJwtToken, async (req, res) => {
  try {
    const { taskId, itemId } = req.params;
    const { selected } = req.body;

    if (!taskId || !itemId || selected === undefined) {
      return res.status(400).json({
        message: "Bad Request: Missing taskId, itemId, or selected field",
        success: false,
      });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, "checklist._id": itemId },
      { $set: { "checklist.$.selected": selected } },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task or checklist item not found",
        success: false,
      });
    }

    res.json({
      message: "Checklist item updated successfully",
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating checklist item:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

module.exports = router;
