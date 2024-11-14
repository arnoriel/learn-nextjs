// pages/api/data.js
let data = { message: 'Initial data' }; // Data yang bisa diubah

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Mengirimkan data saat diminta dengan GET
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    // Mengubah data dengan POST
    const { newData } = req.body; // Ambil data yang dikirim
    if (newData) {
      data = { message: newData }; // Update data
      res.status(200).json({ message: 'Data updated successfully', data });
    } else {
      res.status(400).json({ message: 'No data provided' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
