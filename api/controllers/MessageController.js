import db from "../database/connection.js";

const MessageController = {
  sendMessage: (req, res) => {
    const query =
      "INSERT INTO mensagem (CONTEUDO, ID_CONVERSA, ID_USUARIO) VALUES (?, ?, ?)";

    const { content, chatId, userId } = req.body;

    db.query(query, [content, chatId, userId], (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({ error: "Erro interno no servidor" });
      }

      return res.status(201).json({
        message: "Mensagem enviada com sucesso",
        id: result.insertId,
      });
    });
  },
};

export default MessageController;
