require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const app = express();

app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  try {
    const [rows] = await db.query(
      "SELECT * FROM usuario WHERE name = ? AND password = ?",
      [name, password]
    );
    if (rows.length > 0) {
      res.json({ success: true, message: "Login exitoso" });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Credenciales inválidas" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (_, res) => {
  res.send("Servidor funcionando");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
