// add middlewares here related to projects
// Middleware to validate project data for POST and PUT requests
function validateProjectData(req, res, next) {
  const { name, description } = req.body;
  
  if (!name || !description) {
    return res.status(400).json({ 
      message: 'Please provide name and description for the project' 
    });
  }
  
  // If validation passes, continue to the next middleware/route handler
  next();
}

module.exports = {
  validateProjectData
};