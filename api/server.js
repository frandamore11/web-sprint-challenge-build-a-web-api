const express = require('express');
const projectsRouter = require('./projects/projects-router')
const actionsRouter = require('./actions/actions-router');

const server = express();

// Configure your server here
server.use(express.json());
// Build your actions router in /api/actions/actions-router.js
server.use('/api/actions', actionsRouter);
// Build your projects router in /api/projects/projects-router.js
server.use('/api/projects', projectsRouter)
// Do NOT `server.listen()` inside this file!

module.exports = server;
