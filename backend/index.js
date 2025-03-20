import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Rota para listar flores
app.get('/flowers', async (req, res) => {
  const { data, error } = await supabase.from('flowers').select('*');
  if (error) return res.status(500).json(error);
  res.json(data);
});

// Rota para adicionar uma flor
app.post('/flowers', async (req, res) => {
  const { name, species, color, description } = req.body;
  const { data, error } = await supabase.from('flowers').insert([{ name, species, color, description }]);
  if (error) return res.status(500).json(error);
  res.json(data);
});

// Rota para deletar uma flor
app.delete('/flowers/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('flowers').delete().match({ id });
  if (error) return res.status(500).json(error);
  res.json({ message: 'Flor deletada com sucesso!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
