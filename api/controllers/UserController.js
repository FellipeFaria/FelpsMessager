import db from "../database/connection.js";
import bcrypt from "bcrypt";

const UserController = {
  listUsers: (_, res) => {
    const query = "SELECT ID_USUARIO, NOME, EMAIL FROM usuario";

    db.query(query, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
      }
      return res.status(200).json(data);
    });
  },

  getUserById: (req, res) => {
    const query =
      "SELECT ID_USUARIO, NOME, EMAIL FROM usuario WHERE ID_USUARIO = ?";

    db.query(query, [req.params.userId], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
      }

      return res.status(200).json(data);
    });
  },

  addUser: async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    try {
      const checkUserQuery = "SELECT EMAIL FROM usuario WHERE EMAIL = ?";
      db.query(checkUserQuery, [email], async (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao verificar usuário." });
        }

        if (results.length > 0) {
          return res.status(409).json({ error: "Email já cadastrado." });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const insertQuery =
          "INSERT INTO usuario (NOME, EMAIL, SENHA) VALUES (?, ?, ?)";
        db.query(insertQuery, [nome, email, hashedPassword], (err, result) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ error: "Erro ao cadastrar usuário." });
          }
          return res.status(201).json({
            message: "Usuário criado com sucesso!",
            userId: result.insertId,
          });
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro no servidor." });
    }
  },
};

export default UserController;
