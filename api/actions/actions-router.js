// Write your "actions" router here!
const express = require('express');
const Actions = require('./actions-model');

const router = express.Router();

// [GET] /api/actions - Returns an array of actions
router.get('/', async (req, res) => {
  try {
    console.log('Getting all actions...');
    const actions = await Actions.get();
    res.status(200).json(actions);
  } catch (error) {
    console.log('Error getting actions:', error.message);
    res.status(500).json({ 
      message: 'The actions information could not be retrieved' 
    });
  }
});

// [GET] /api/actions/:id - Returns an action with the given id
router.get('/:id', async (req, res) => {
  try {
    console.log('Getting action with ID:', req.params.id);
    const action = await Actions.get(req.params.id);
    
    if (action) {
      res.status(200).json(action);
    } else {
      res.status(404).json({ 
        message: 'The action with the specified ID does not exist' 
      });
    }
  } catch (error) {
    console.log('Error getting action by ID:', error.message);
    res.status(500).json({ 
      message: 'The action information could not be retrieved' 
    });
  }
});

// [POST] /api/actions - Creates a new action
router.post('/', async (req, res) => {
  try {
    console.log('Creating action with data:', req.body);
    const { project_id, description, notes } = req.body;
    
    // Check if required fields are provided
    if (!project_id || !description || !notes) {
      return res.status(400).json({ 
        message: 'Please provide project_id, description, and notes for the action' 
      });
    }

    // Check if the project exists (since project_id must belong to an existing project)
    const Projects = require('../projects/projects-model');
    const project = await Projects.get(project_id);
    
    if (!project) {
      return res.status(400).json({ 
        message: 'The project_id provided does not belong to an existing project' 
      });
    }

    const newAction = await Actions.insert(req.body);
    res.status(201).json(newAction);
  } catch (error) {
    console.log('Error creating action:', error.message);
    res.status(500).json({ 
      message: 'There was an error while saving the action to the database' 
    });
  }
});

// [PUT] /api/actions/:id - Updates the action with the given id
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating action ID:', req.params.id, 'with data:', req.body);
    const { project_id, description, notes } = req.body;
    
    // Check if required fields are provided
    if (!project_id || !description || !notes) {
      return res.status(400).json({ 
        message: 'Please provide project_id, description, and notes for the action' 
      });
    }

    // Check if the project exists
    const Projects = require('../projects/projects-model');
    const project = await Projects.get(project_id);
    
    if (!project) {
      return res.status(400).json({ 
        message: 'The project_id provided does not belong to an existing project' 
      });
    }

    const updatedAction = await Actions.update(req.params.id, req.body);
    
    if (updatedAction) {
      res.status(200).json(updatedAction);
    } else {
      res.status(404).json({ 
        message: 'The action with the specified ID does not exist' 
      });
    }
  } catch (error) {
    console.log('Error updating action:', error.message);
    res.status(500).json({ 
      message: 'The action information could not be modified' 
    });
  }
});

// [DELETE] /api/actions/:id - Deletes the action with the given id
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting action with ID:', req.params.id);
    const deletedCount = await Actions.remove(req.params.id);
    
    if (deletedCount) {
      res.status(200).json({ 
        message: 'The action has been deleted' 
      });
    } else {
      res.status(404).json({ 
        message: 'The action with the specified ID does not exist' 
      });
    }
  } catch (error) {
    console.log('Error deleting action:', error.message);
    res.status(500).json({ 
      message: 'The action could not be removed' 
    });
  }
});

module.exports = router;