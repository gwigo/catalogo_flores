import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors({
  origin: '*', // Permite qualquer origem (pode ser alterado para um domínio específico)
  methods: ['GET', 'POST'], // Especifica os métodos permitidos
  allowedHeaders: ['Content-Type'], // Permite headers necessários
}));

app.use(express.json());

// Configurar Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Rota raiz
app.get('/', (req, res) => {
  res.send('🌸 Bem-vindo ao catálogo de flores!');
});

// Rota para listar flores
app.get('/flores', async (req, res) => {
  try {
    const { data, error } = await supabase.from('flores').select('*');
    if (error) return res.status(500).json({ error: 'Erro ao buscar flores', details: error });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro inesperado', details: error.message });
  }
});

// Rota para adicionar uma flor
app.post('/flores', async (req, res) => {
  const { nome, especie, cor, descricao } = req.body;
  if (!nome || !especie || !cor || !descricao) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  try {
    const { data, error } = await supabase.from('flores').insert([{ nome, especie, cor, descricao }]).select();
    if (error) return res.status(500).json({ error: 'Erro ao adicionar flor', details: error });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro inesperado', details: error.message });
  }
});

// Exportação para o Vercel
export default app;
