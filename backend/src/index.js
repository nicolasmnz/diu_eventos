import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import pool from './config/db.js';

const app = express();

app.use(cors());
app.use(express.json());


const readData = () => {
  const Data = fs.readFileSync('./src/data.json','utf-8');
  return JSON.parse(Data);
};

app.get('/eventos',(req, res) => {
  const eventos = readData();
  res.json(eventos)
})

// Una ruta de prueba simple para saber si la base de datos responde
app.get('/', async (req, res) => {
    res.send(`Backend funcionando.`);

});

app.listen(5000, () => {
  console.log("Servidor corriendo en el puerto 5000");
});