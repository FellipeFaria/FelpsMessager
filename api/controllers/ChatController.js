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

  getChat: async (req, res) => {
    try {
      const { chatId } = req.params;

      // 1. Validação do ID
      if (!chatId || isNaN(chatId)) {
        return res.status(400).json({ error: "ID de conversa inválido" });
      }

      // 2. Consulta a conversa
      let conversa;
      try {
        // Consulta a conversa
        const [conversaRows] = await db.query(
          "SELECT * FROM conversa WHERE ID_CONVERSA = ?",
          [chatId]
        );

        if (conversaRows.length === 0) {
          return res.status(404).json({ error: "Conversa não encontrada" });
        }

        const conversaData = conversaRows[0];

        // Busca os dados dos usuários
        const [usuario1Rows] = await db.query(
          "SELECT ID_USUARIO, NOME FROM usuario WHERE ID_USUARIO = ?",
          [conversaData.ID_USUARIO1]
        );
        const usuario1 = usuario1Rows[0] || null;

        const [usuario2Rows] = await db.query(
          "SELECT ID_USUARIO, NOME FROM usuario WHERE ID_USUARIO = ?",
          [conversaData.ID_USUARIO2]
        );
        const usuario2 = usuario2Rows[0] || null;

        conversa = {
          ...conversaData,
          USUARIO1: usuario1,
          USUARIO2: usuario2,
        };
      } catch (dbError) {
        console.error("Erro na consulta:", dbError);
        return res.status(500).json({ error: "Erro ao buscar conversa" });
      }

      // 3. Consulta as mensagens
      let mensagens = [];
      try {
        const [mensagensRows] = await db.query(
          `SELECT m.*, u.NOME AS REMETENTE_NOME 
         FROM mensagem m 
         LEFT JOIN usuario u ON m.ID_USUARIO = u.ID_USUARIO 
         WHERE m.ID_CONVERSA = ? 
         ORDER BY m.DATA_ENVIO DESC`,
          [chatId]
        );

        mensagens = mensagensRows || [];
      } catch (msgError) {
        console.error("Erro ao buscar mensagens:", msgError);
      }

      // 4. Monta a resposta final
      const response = {
        conversa: {
          id: conversa.ID_CONVERSA,
          usuario1: {
            id: conversa.ID_USUARIO1,
            nome: conversa.USUARIO1?.NOME || "Usuário desconhecido",
          },
          usuario2: {
            id: conversa.ID_USUARIO2,
            nome: conversa.USUARIO2?.NOME || "Usuário desconhecido",
          },
        },
        mensagens: mensagens.map((msg) => ({
          id: msg.ID_MENSAGEM,
          conteudo: msg.CONTEUDO,
          enviador: {
            id: msg.ID_USUARIO,
            nome: msg.REMETENTE_NOME || "Remetente desconhecido",
          },
          dataEnvio: msg.DATA_ENVIO,
        })),
      };

      return res.status(200).json(response);
    } catch (err) {
      console.error("Erro geral:", err);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
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
