// add middlewares here related to actions
// Middleware to validate action data for POST and PUT requests
function validateActionData(req, res, next) {
  const { project_id, description, notes } = req.body;
  
  if (!project_id || !description || !notes) {
    return res.status(400).json({ 
      message: 'Please provide project_id, description, and notes for the action' 
    });
  }
  
  // If validation passes, continue to the next middleware/route handler
  next();
}

// Middleware to check if project exists (for actions that need valid project_id)
async function validateProjectExists(req, res, next) {
  try {
    const Projects = require('../projects/projects-model');
    const project = await Projects.get(req.body.project_id);
    
    if (!project) {
      return res.status(400).json({ 
        message: 'The project_id provided does not belong to an existing project' 
      });
    }
    
    // If project exists, continue
    next();
  } catch (error) {
    res.status(500).json({ 
      message: 'Error validating project' 
    });
  }
}

module.exports = {
  validateActionData,
  validateProjectExists
};