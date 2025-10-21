import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import kanbanRoutes from './routes/kanbanRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api', kanbanRoutes);

app.get('/', (req, res) => res.send('API do Kanban funcionando com TypeScript!'));

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
