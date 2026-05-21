import express from 'express';
import cors from 'cors';
import pool from './config/db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Una ruta de prueba simple para saber si la base de datos responde
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Backend funcionando. Conexión a la base de datos OK: ${result.rows[0].now}`);
  } catch (error) {
    res.status(500).send("Backend funcionando, pero error al conectar a Postgres.");
  }
});

app.listen(5000, () => {
  console.log("Servidor corriendo en el puerto 5000");
});