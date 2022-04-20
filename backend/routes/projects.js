const express = require('express');
const { body, validationResult } = require('express-validator');
const { NotBeforeError } = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const Project = require('../models/Project');
const router = express.Router()


// ROUTE 1 : Add a new note  using POST : "/api/notes/addnote". Login required
router.post('/addproject', fetchUser, [
    body('title', 'Enter a valid project title').isLength({ min: 2 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {
            const { title, description, category, startDate, endDate,notes } = req.body;
            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const project = new Project({
                title, description, category,startDate,endDate,notes, user: req.user.id
            })
            const savedProject = await project.save()
            res.json(savedProject)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

// Route 2 
    router.get('/fetchallprojects', fetchUser, async (req, res) => {
        try {
    
            const projects = await Project.find({ user: req.user.id })
            res.json(projects)
        } catch (error) {
            console.error(error.message)
            res.status(500).send("Internal Server Error")
        }
    
    })

    // Route 3
    router.put('/updateproject/:id', fetchUser, async (req, res) => {
        const { title, description, category, startDate, endDate, notes  } = req.body;
        try {
    
            // Create a new note
            const newProject = {}
            if (title) {
                newProject.title = title
            }
            if (description) {
                newProject.description = description
            }
            if (category) {
                newProject.category = category
            }
            if(startDate){
                newProject.startDate = startDate
            }
            if(endDate){
                newProject.endDate = endDate
            }
            if(notes){
                newProject.notes = notes
            }
    
            // FInd the note to be updated and update it
            let project = await Project.findById(req.params.id)
            if (!project) {
                res.status(404).send("Not found")
            }
            if (project.user.toString() !== req.user.id) {
                return res.status(401).send("Not Allowed")
            }
    
            project = await Project.findByIdAndUpdate(req.params.id, { $set: newProject }, { new: true })
            res.json(project)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

    // Route 4
    router.delete('/deleteproject/:id',fetchUser,async(req,res)=>{
        try {        
            // FInd the subject to be deleted and delete it
            let project = await Project.findById(req.params.id)
            if (!project) {
                res.status(404).send("Not found")
            }
            // Allow deletion only if the faculty owns this subject
            if (project.user.toString() !== req.user.id) {
                return res.status(401).send("Not Allowed")
            }
    
            project = await Project.findByIdAndDelete(req.params.id)
            res.json({"Success":"Project has been deleted",project:project})
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
         
    }) 
    module.exports = router