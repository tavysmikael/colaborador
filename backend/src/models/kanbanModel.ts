import { pool } from '../config/db.js';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignee: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getTasks(): Promise<Task[]> {
  const res = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
  return res.rows;
}

export async function createTask(task: Task): Promise<Task> {
  const { title, description, status, priority, assignee, due_date } = task;
  const res = await pool.query(
    'INSERT INTO tasks (title, description, status, priority, assignee, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [title, description, status, priority, assignee, due_date]
  );
  return res.rows[0];
}

export async function updateTask(id: number, task: Task): Promise<Task> {
  const { title, description, status, priority, assignee, due_date } = task;
  const res = await pool.query(
    'UPDATE tasks SET title=$1, description=$2, status=$3, priority=$4, assignee=$5, due_date=$6, updated_at=NOW() WHERE id=$7 RETURNING *',
    [title, description, status, priority, assignee, due_date, id]
  );
  return res.rows[0];
}

export async function deleteTask(id: number) {
  await pool.query('DELETE FROM tasks WHERE id=$1', [id]);
  return { message: 'Task deleted' };
}
