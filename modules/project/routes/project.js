const express = require('express');
const stringHelper = require('./../../../helpers/stringHelper');
const router = express.Router();
const projectModule = require('../../../modules').modules.project;
const User = require('../../../modules').modules.user.models.User;
const models = projectModule.models;

router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);
router.post('/projects/mark-stable/:domainId', markStable);

async function createProject(req, res, next) {
  try {
    const body = req.body;
    if (!Object.keys(body).length) {
      return triggerError(res, "Invalid params provided");
    }

    const params = Object.assign({}, body, {
      folder_name: stringHelper.getUniqueString()
    });

    const project = await Project.createProject(params);

    return res.json(project.getJson());
  } catch (e) {
    return triggerError(res, 'Error while creating project');
  }
}

function getProjects(req, res, next) {
  Project.scope('notDeleted').findAll({
    include: [
      {
        model: User,
        attributes: ['username','id'],
        as: 'createdBy',
        required: false,
      },
    ]
  }).then(projects => {
    return res.json(projects.filter(project => project.getJson()))
  }, error => {
    return res.status(422).json({
      message: 'Error while selecting projects'
    })
  });
}

function getProjectById(req, res, next) {
  if (req.params.id) {
    Project.scope('notDeleted').findById(req.params.id).then(project => {
      return res.json(project.getJson());
    }, error => {
      return res.status(422).json({
        message: 'Error while selecting project'
      })
    })
  } else {
    return res.status(422).json({
      message: 'Invalid params provided'
    })
  }
}

function updateProject(req, res, next) {
  const body = req.body;
  if (req.params.id && Object.keys(body).length > 0) {
    Project.scope('notDeleted').findById(req.params.id).then(project => {
      project.update(body).then(updatedProject => {
        return res.json(updatedProject.getJson());
      }, error => {
        return res.status(422).json({
          message: 'Error while updating project'
        })
      })
    }, error => {
      return res.status(422).json({
        message: 'Error while selecting project'
      })
    })
  } else {
    return res.status(422).json({
      message: 'Invalid params provided'
    })
  }
}

async function deleteProject(req, res, next) {
  try {
    const project = await Project.scope('notDeleted').findById(req.params.id);

    if (!project) {
      return triggerError(res, 'Invalid project id provided');
    }

    await project.markDeleted();

    return res.json({
      message: 'Project deleted successfully'
    });
  } catch (error) {
    return triggerError('Error while handling project deletion');
  }
}


function triggerError(res, errorMessage) {
  return res.status(422).json({
    message: errorMessage
  })
}

module.exports = router;
