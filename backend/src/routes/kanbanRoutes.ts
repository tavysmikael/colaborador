import express from 'express';
import { getAllTasks, addTask, editTask, removeTask } from '../controllers/kanbanController.js';

const router = express.Router();

router.get('/tasks', getAllTasks);
router.post('/tasks', addTask);
router.put('/tasks/:id', editTask);
router.delete('/tasks/:id', removeTask);

export default router;
