import db from "../database/connection.js";

const ChatController = {
  listChats: (req, res) => {
    const query = `SELECT * FROM conversa WHERE ID_USUARIO1 = ? OR ID_USUARIO2 = ? ORDER BY DATA_CRIACAO DESC`;

    const { id_usuario } = req.body;

    db.query(query, [id_usuario, id_usuario], (err, data) => {
      if (err) {
        console.error(err);

        return res.status(500).json({ error: "Erro interno no servidor" });
      }

      return res.status(200).json(data);
    });
  },

  createChat: (req, res) => {
    const { id_usuario1, email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: "Informe o email do usuario para começar a conversa" });
    }

    let query = "SELECT ID_USUARIO FROM usuario WHERE EMAIL = ?";

    db.query(query, [email], (err, data) => {
      if (err) {
        console.error(err);

        return res.status(500).json({ error: "Erro interno no servidor" });
      }

      if (data.length === 0) {
        return res.status(404).json({ error: "Usuario não encontrado" });
      }

      const id_usuario2 = data[0].ID_USUARIO;

      query = "INSERT INTO conversa (ID_USUARIO1, ID_USUARIO2) VALUES (?, ?)";

      db.query(query, [id_usuario1, id_usuario2], (err, result) => {
        if (err) {
          console.error(err);

          return res.status(500).json({ error: "Erro interno no servidor" });
        }

        return res.status(201).json({
          message: "Conversa iniciada com sucesso",
          chatId: result.insertId,
        });
      });
    });
  },
};

export default ChatController;
