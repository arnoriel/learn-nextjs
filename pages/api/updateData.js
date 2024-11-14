export default function handler(req, res) {
    if (req.method === 'POST') {
      const { newData } = req.body;
  
      // Simulasikan update data
      const updatedData = { message: `Data updated: ${newData}` };
  
      res.status(200).json(updatedData);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  