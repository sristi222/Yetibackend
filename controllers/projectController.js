const Project = require("../models/ProjectPhase");
const path = require("path");
const fs = require("fs");

// Valid status options
const validStatuses = ["Upcoming", "In Progress", "Nearly Complete"];

// GET all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// GET single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// CREATE new project
exports.createProject = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const { phase, title, description, progress, status, milestones } = req.body;

    // Validate status
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: `Status must be one of ${validStatuses.join(", ")}` });
    }

    // Validate progress
    const progressNumber = Number(progress);
    if (isNaN(progressNumber) || progressNumber < 0 || progressNumber > 100) {
      return res
        .status(400)
        .json({ message: "Progress must be a number between 0 and 100" });
    }

    const project = new Project({
      phase,
      title,
      description,
      progress: progressNumber,
      status,
      milestones: milestones ? JSON.parse(milestones) : [],
      image: req.file.filename,
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: "Failed to create project", error: err.message });
  }
};

// UPDATE project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { phase, title, description, progress, status, milestones } = req.body;

    // Update fields if provided
    project.phase = phase || project.phase;
    project.title = title || project.title;
    project.description = description || project.description;

    if (progress !== undefined) {
      const progressNumber = Number(progress);
      if (isNaN(progressNumber) || progressNumber < 0 || progressNumber > 100) {
        return res
          .status(400)
          .json({ message: "Progress must be a number between 0 and 100" });
      }
      project.progress = progressNumber;
    }

    if (status) {
      if (!validStatuses.includes(status)) {
        return res
          .status(400)
          .json({ message: `Status must be one of ${validStatuses.join(", ")}` });
      }
      project.status = status;
    }

    project.milestones = milestones ? JSON.parse(milestones) : project.milestones;

    // Handle new image
    if (req.file) {
      const oldPath = path.join(__dirname, "../uploads", project.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      project.image = req.file.filename;
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: "Failed to update project", error: err.message });
  }
};

// DELETE project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Remove image
    const imgPath = path.join(__dirname, "../uploads", project.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete project", error: err.message });
  }
};
