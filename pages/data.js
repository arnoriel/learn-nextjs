// pages/api/data.js
import supabase from '../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Ambil data dari Supabase
    const { data, error } = await supabase
      .from('texts')
      .select('*');
    if (error) {
      return res.status(500).json({ message: 'Error fetching data' });
    }
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { text } = req.body;
    if (text) {
      const { data, error } = await supabase
        .from('texts')
        .insert([{ text }]);
      if (error) {
        return res.status(500).json({ message: 'Error adding text' });
      }
      res.status(200).json({ message: 'Text added successfully', data });
    } else {
      res.status(400).json({ message: 'Text is required' });
    }
  } else if (req.method === 'PUT') {
    const { id, newText } = req.body;
    if (id && newText) {
      const { data, error } = await supabase
        .from('texts')
        .update({ text: newText })
        .eq('id', id);
      if (error) {
        return res.status(500).json({ message: 'Error updating text' });
      }
      res.status(200).json({ message: 'Text updated successfully', data });
    } else {
      res.status(400).json({ message: 'ID and new text are required' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    if (id) {
      const { data, error } = await supabase
        .from('texts')
        .delete()
        .eq('id', id);
      if (error) {
        return res.status(500).json({ message: 'Error deleting text' });
      }
      res.status(200).json({ message: 'Text deleted successfully', data });
    } else {
      res.status(400).json({ message: 'ID is required' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
