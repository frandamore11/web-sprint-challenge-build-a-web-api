// Write your "projects" router here!
const express = require('express');
const Projects = require('./projects-model');
const { validateProjectData } = require('./projects-middleware');

const router = express.Router();

// [GET] /api/projects - Returns an array of projects
router.get('/', async (req, res) => {
  try {
    console.log('Attempting to get projects...');
    const projects = await Projects.get();
    // console.log('Projects retrieved:', projects);
    res.status(200).json(projects);
  } catch (error) {
    // console.log('Error occurred:', error.message);
    // console.log('Full error:', error);
    res.status(500).json({ 
      message: 'The projects information could not be retrieved' 
    });
  }
});

// [GET] /api/projects/:id - Returns a project with the given id
router.get('/:id', async (req, res) => {
  try {
    console.log('Getting project with ID:', req.params.id);
    const project = await Projects.get(req.params.id);
    
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ 
        message: 'The project with the specified ID does not exist' 
      });
    }
  } catch (error) {
    console.log('Error getting project by ID:', error.message);
    res.status(500).json({ 
      message: 'The project information could not be retrieved' 
    });
  }
});

// [POST] /api/projects - Creates a new project (WITH MIDDLEWARE)
router.post('/', validateProjectData, async (req, res) => {
  try {
    // No need to validate here anymore - middleware handles it!
    const newProject = await Projects.insert(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ 
      message: 'There was an error while saving the project to the database' 
    });
  }
});

// [PUT] /api/projects/:id - Updates the project (WITH MIDDLEWARE)
router.put('/:id', validateProjectData, async (req, res) => {
  try {
    // No need to validate here anymore - middleware handles it!
    const updatedProject = await Projects.update(req.params.id, req.body);
    
    if (updatedProject) {
      res.status(200).json(updatedProject);
    } else {
      res.status(404).json({ 
        message: 'The project with the specified ID does not exist' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'The project information could not be modified' 
    });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting project with ID:', req.params.id);
    const deletedCount = await Projects.remove(req.params.id);
    
    if (deletedCount) {
      res.status(200).json({ 
        message: 'The project has been deleted' 
      });
    } else {
      res.status(404).json({ 
        message: 'The project with the specified ID does not exist' 
      });
    }
  } catch (error) {
    console.log('Error deleting project:', error.message);
    res.status(500).json({ 
      message: 'The project could not be removed' 
    });
  }
});

// [GET] /api/projects/:id/actions - Returns actions for a project
router.get('/:id/actions', async (req, res) => {
  try {
    console.log('Getting actions for project ID:', req.params.id);
    
    // First check if the project exists
    const project = await Projects.get(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        message: 'The project with the specified ID does not exist' 
      });
    }

    const actions = await Projects.getProjectActions(req.params.id);
    res.status(200).json(actions);
  } catch (error) {
    console.log('Error getting project actions:', error.message);
    res.status(500).json({ 
      message: 'The actions information could not be retrieved' 
    });
  }
});

module.exports = router;