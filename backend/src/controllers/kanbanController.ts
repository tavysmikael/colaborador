import { Request, Response } from 'express';
import * as Kanban from '../models/kanbanModel.js';

export async function getAllTasks(req: Request, res: Response) {
  try {
    const tasks = await Kanban.getTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function addTask(req: Request, res: Response) {
  try {
    const newTask = await Kanban.createTask(req.body);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function editTask(req: Request, res: Response) {
  try {
    const updatedTask = await Kanban.updateTask(Number(req.params.id), req.body);
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function removeTask(req: Request, res: Response) {
  try {
    const result = await Kanban.deleteTask(Number(req.params.id));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
