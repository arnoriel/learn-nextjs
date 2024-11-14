// pages/data.js
import { useState, useEffect } from 'react';

export default function DataPage() {
  const [data, setData] = useState({ message: 'Loading...' });
  const [newData, setNewData] = useState('');
  const [error, setError] = useState('');

  // Ambil data saat halaman pertama kali dimuat
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

  // Fungsi untuk mengubah data
  const handleUpdateData = async () => {
    if (!newData) {
      setError('Data cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newData }),
      });
      const result = await response.json();

      if (response.ok) {
        setData(result.data); // Update data yang ditampilkan
        setNewData(''); // Reset input
        setError('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError('Error updating data');
    }
  };

  return (
    <div>
      <h1>Data Page</h1>
      <div>
        <p>Current Data: {data.message}</p>
      </div>

      <div>
        <h2>Update Data</h2>
        <input
          type="text"
          value={newData}
          onChange={(e) => setNewData(e.target.value)}
          placeholder="Enter new data"
        />
        <button onClick={handleUpdateData}>Update</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}
