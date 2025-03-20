// frontend/src/App.jsx
import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'COLOQUE_AQUI_A_URL_DO_BACKEND';

function App() {
  const [flowers, setFlowers] = useState([]);
  const [newFlower, setNewFlower] = useState({ name: '', species: '', color: '', description: '' });

  useEffect(() => {
    fetch(`${API_URL}/flowers`)
      .then((res) => res.json())
      .then(setFlowers);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/flowers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFlower),
    });
    setNewFlower({ name: '', species: '', color: '', description: '' });
    window.location.reload();
  };

  return (
    <div className="container">
      <h1>🌸 Catálogo de Flores</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome" value={newFlower.name} onChange={(e) => setNewFlower({ ...newFlower, name: e.target.value })} />
        <input placeholder="Espécie" value={newFlower.species} onChange={(e) => setNewFlower({ ...newFlower, species: e.target.value })} />
        <input placeholder="Cor" value={newFlower.color} onChange={(e) => setNewFlower({ ...newFlower, color: e.target.value })} />
        <textarea placeholder="Descrição" value={newFlower.description} onChange={(e) => setNewFlower({ ...newFlower, description: e.target.value })} />
        <button type="submit">Adicionar</button>
      </form>
      <ul>
        {flowers.map((flower) => (
          <li key={flower.id}>{flower.name} - {flower.species} ({flower.color})</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
