import { useEffect, useState } from 'react';
import './App.css';

// URL do backend (corrigida)
const API_URL = 'https://catalogo-flores-dm58477oj-guilhermes-projects-48ef2b25.vercel.app';
// Coloque seu token aqui, caso seja necessário para autenticação
const TOKEN = 'seuTokenAqui'; // Substitua com o token correto

function App() {
  const [flores, setFlores] = useState([]);
  const [novaFlor, setNovaFlor] = useState({ nome: '', especie: '', cor: '', descricao: '' });
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Carregar flores da API
  useEffect(() => {
    const carregarFlores = async () => {
      try {
        const resposta = await fetch(`${API_URL}/flores`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`, // Envia o token de autenticação
          },
        });
        if (!resposta.ok) throw new Error('Erro ao carregar flores');
        const dados = await resposta.json();
        setFlores(dados);
      } catch (error) {
        setErro('Erro ao carregar flores');
        console.error(error);
      }
    };
    carregarFlores();
  }, []);

  // Adicionar flor
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`${API_URL}/flores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`, // Envia o token de autenticação
        },
        body: JSON.stringify(novaFlor),
      });

      if (!res.ok) throw new Error('Falha ao adicionar a flor');
      
      const data = await res.json();
      setFlores((prevFlores) => [...prevFlores, ...data]);
      setMensagem('Flor adicionada com sucesso!');
      setNovaFlor({ nome: '', especie: '', cor: '', descricao: '' });
      setErro('');
    } catch (error) {
      setErro(error.message);
      setMensagem('');
    }
  };

  return (
    <div className="container">
      <h1>🌸 Catálogo de Flores</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome"
          value={novaFlor.nome}
          onChange={(e) => setNovaFlor({ ...novaFlor, nome: e.target.value })}
        />
        <input
          placeholder="Espécie"
          value={novaFlor.especie}
          onChange={(e) => setNovaFlor({ ...novaFlor, especie: e.target.value })}
        />
        <input
          placeholder="Cor"
          value={novaFlor.cor}
          onChange={(e) => setNovaFlor({ ...novaFlor, cor: e.target.value })}
        />
        <textarea
          placeholder="Descrição"
          value={novaFlor.descricao}
          onChange={(e) => setNovaFlor({ ...novaFlor, descricao: e.target.value })}
        />
        <button type="submit">Adicionar</button>
      </form>

      {mensagem && <div className="success-message">{mensagem}</div>}
      {erro && <div className="error-message">{erro}</div>}

      <ul>
        {flores.map((flor) => (
          <li key={flor.id}>
            {flor.nome} - {flor.especie} ({flor.cor})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
