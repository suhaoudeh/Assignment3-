import ProjectModel from '../models/project.js';

// Create CRUD operations for Project

// Get All Projects = Same as db.projects.find()
export const getAllProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 HTTP status code for server error
    }
}

// Read a project by ID = Same as db.projects.findOne({_id: ObjectId("id")})
export const getProjectById = async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' }); // 404 HTTP status code for not found
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 HTTP status code for server error
    }
}

// Create a new project = Same as db.projects.insertOne()
export const createProject = async (req, res) => {
    try {
        const newProject = new ProjectModel(req.body);
        const savedProject = await newProject.save();
        res.status(201).json(savedProject); // 201 HTTP status code for created
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 HTTP status code for server error
    }
}

// Update a project by ID = Same as db.projects.updateOne({_id: ObjectId("id")}, {$set: {...}})
export const updateProject = async (req, res) => {
    try {
        const updatedProject = await ProjectModel.findByIdAndUpdate(req.params.id,req.body, {
            new: true
        });

        if (!updatedProject){
            return res.status(404).json({ message: 'Project not found' }); // 404 HTTP status code for not found
        }

        res.status(200).json(updatedProject);
    } catch (error) {
       res.status(500).json({ message: error.message }); // 500 HTTP status code for server error
    }
}

// Delete a project by ID = Same as db.projects.deleteOne({_id: ObjectId("id")})
export const deleteProject = async (req, res) => {
    try {
        const deletedProject = await ProjectModel.findByIdAndDelete(req.params.id);

        if (!deletedProject){
            return res.status(404).json({ message: 'Project not found' }); // 404 HTTP status code for not found
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 HTTP status code for server error
    }
}