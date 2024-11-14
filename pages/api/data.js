export default function handler(req, res) {
    // Cek method request (GET, POST, dll)
    if (req.method === 'GET') {
      // Data statis untuk contoh
      const data = { message: 'Hello from serverless function!' };
  
      // Kirim response dengan status 200 dan data
      res.status(200).json(data);
    } else {
      // Menangani metode selain GET
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  