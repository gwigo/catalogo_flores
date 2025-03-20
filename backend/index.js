import dotenv from 'dotenv';
dotenv.config(); // Carrega as variáveis de ambiente

import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();

// Verifique se as variáveis de ambiente estão carregadas corretamente
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error("Erro: SUPABASE_URL ou SUPABASE_KEY não estão definidas no .env");
  process.exit(1); // Encerra a aplicação se as variáveis de ambiente estiverem ausentes
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.send('🌸 Bem-vindo ao catálogo de flores!');
});

// Rota para listar flores (GET)
app.get('/flores', async (req, res) => {
  try {
    const { data, error } = await supabase.from('flores').select('*');

    if (error) {
      return res.status(500).json({ error: 'Erro ao buscar flores', details: error });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro inesperado', details: error.message });
  }
});

// Rota para adicionar uma flor (POST)
app.post('/flores', async (req, res) => {
  const { nome, especie, cor, descricao } = req.body;

  if (!nome || !especie || !cor || !descricao) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const { data, error } = await supabase
      .from('flores')
      .insert([{ nome, especie, cor, descricao }])
      .select();

    if (error) {
      return res.status(500).json({ error: 'Erro ao adicionar flor', details: error });
    }

    res.status(201).json(data); // Retorna a flor adicionada
  } catch (error) {
    res.status(500).json({ error: 'Erro inesperado', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
