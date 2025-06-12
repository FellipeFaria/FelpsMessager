import db from "./connection.js";

async function criarTabelas() {
  try {
    // Desativa o autocommit para trabalhar com transações
    await db.query("SET autocommit = 0");

    // Inicia a transação manualmente
    await db.query("START TRANSACTION");

    const sql = `
      DROP TABLE IF EXISTS mensagem;
      DROP TABLE IF EXISTS conversa;
      DROP TABLE IF EXISTS usuario;

      CREATE TABLE usuario (
        ID_USUARIO INT PRIMARY KEY AUTO_INCREMENT,
        NOME VARCHAR(50) NOT NULL,
        EMAIL VARCHAR(255) NOT NULL UNIQUE,
        SENHA VARCHAR(255) NOT NULL,
        DATA_CRIACAO TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE conversa (
        ID_CONVERSA INT PRIMARY KEY AUTO_INCREMENT,
        ID_USUARIO1 INT,
        ID_USUARIO2 INT,
        DATA_CRIACAO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ID_USUARIO1) REFERENCES usuario(ID_USUARIO) ON DELETE CASCADE,
        FOREIGN KEY (ID_USUARIO2) REFERENCES usuario(ID_USUARIO) ON DELETE CASCADE,
        UNIQUE KEY unique_conversa (ID_USUARIO1, ID_USUARIO2)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE mensagem (
        ID_MENSAGEM INT PRIMARY KEY AUTO_INCREMENT,
        CONTEUDO TEXT NOT NULL,
        DATA_ENVIO DATETIME DEFAULT CURRENT_TIMESTAMP,
        ID_CONVERSA INT,
        ID_USUARIO INT,
        FOREIGN KEY (ID_CONVERSA) REFERENCES conversa(ID_CONVERSA) ON DELETE CASCADE,
        FOREIGN KEY (ID_USUARIO) REFERENCES usuario(ID_USUARIO) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await db.query(sql);

    // Confirma a transação
    await db.query("COMMIT");
    console.log("Banco resetado com sucesso");
  } catch (e) {
    // Reverte em caso de erro
    await db.query("ROLLBACK");
    console.error("Erro ao resetar o banco: ", e);
    process.exit(1);
  } finally {
    // Reativa o autocommit
    await db.query("SET autocommit = 1");
    await db.end();
  }
}

// Executa a função
criarTabelas()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
