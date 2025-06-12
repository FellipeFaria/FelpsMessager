import db from "../database/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    try {
      const query = "SELECT * FROM usuario WHERE EMAIL = ?";

      db.query(query, [email], async (err, results) => {
        if (err) {
          console.error(err);

          return res.status(500).json({ error: "Erro interno no servidor" });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Esse email não existe" });
        }

        const user = results[0];

        const validPassword = await bcrypt.compare(password, user.SENHA);

        if (!validPassword) {
          return res.status(401).json({ error: "Senha incorreta" });
        }

        const token = jwt.sign(
          { id: user.ID_USUARIO, email: user.EMAIL },
          process.env.JWT_SECRET,
          { expiresIn: "8h" }
        );

        const { SENHA, ...userData } = user;

        return res.status(200).json({
          message: "Login realizado com sucesso",
          token,
          user: userData,
        });
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  },

  verifyToken: (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ error: "Token não fornecido" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
      }

      req.userId = decoded.id;
      next();
    });
  },
};

export default AuthController;
