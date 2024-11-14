import { useState, useEffect } from 'react';

export default function DataPage() {
  const [data, setData] = useState([]);
  const [newText, setNewText] = useState('');
  const [editText, setEditText] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  // Ambil data dari API saat halaman dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError('Error fetching data');
      }
    };
    fetchData();
  }, []);

  // Menambahkan teks baru
  const handleAddText = async () => {
    if (!newText) {
      setError('Text cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText }),
      });
      const result = await response.json();
      if (response.ok) {
        setData(result.data);
        setNewText('');
        setError('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError('Error adding text');
    }
  };

  // Mengedit teks
  const handleEditText = async () => {
    if (!editText || !editId) {
      setError('Text and ID are required');
      return;
    }

    try {
      const response = await fetch('/api/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, newText: editText }),
      });
      const result = await response.json();
      if (response.ok) {
        setData(result.data);
        setEditText('');
        setEditId(null);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError('Error updating text');
    }
  };

  // Menghapus teks
  const handleDeleteText = async (id) => {
    try {
      const response = await fetch('/api/data', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (response.ok) {
        setData(result.data);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError('Error deleting text');
    }
  };

  return (
    <div>
      <h1>Data Page</h1>
      <div>
        <h2>Add Text</h2>
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Enter new text"
        />
        <button onClick={handleAddText}>Add</button>
      </div>

      <div>
        <h2>Edit Text</h2>
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          placeholder="Edit text"
        />
        <button onClick={handleEditText}>Update</button>
      </div>

      <div>
        <h2>Existing Text</h2>
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              {item.text} 
              <button onClick={() => { setEditId(item.id); setEditText(item.text); }}>Edit</button>
              <button onClick={() => handleDeleteText(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
