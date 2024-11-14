import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

// Fungsi untuk membaca data dari file JSON
const readData = () => {
  try {
    const fileContent = fs.readFileSync(dataFilePath);
    return JSON.parse(fileContent);
  } catch (error) {
    return []; // Kembalikan array kosong jika file tidak ada atau error
  }
};

// Fungsi untuk menyimpan data ke file JSON
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Ambil data dari file JSON
    const data = readData();
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    // Menambah data
    const { text } = req.body;
    if (text) {
      const data = readData();
      data.push({ id: Date.now(), text }); // Menambahkan teks baru dengan ID unik
      writeData(data);
      res.status(200).json({ message: 'Text added successfully', data });
    } else {
      res.status(400).json({ message: 'Text is required' });
    }
  } else if (req.method === 'PUT') {
    // Mengedit data
    const { id, newText } = req.body;
    if (id && newText) {
      const data = readData();
      const index = data.findIndex((item) => item.id === id);
      if (index !== -1) {
        data[index].text = newText;
        writeData(data);
        res.status(200).json({ message: 'Text updated successfully', data });
      } else {
        res.status(404).json({ message: 'Text not found' });
      }
    } else {
      res.status(400).json({ message: 'ID and new text are required' });
    }
  } else if (req.method === 'DELETE') {
    // Menghapus data
    const { id } = req.body;
    if (id) {
      const data = readData();
      const newData = data.filter((item) => item.id !== id);
      writeData(newData);
      res.status(200).json({ message: 'Text deleted successfully', data: newData });
    } else {
      res.status(400).json({ message: 'ID is required' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
