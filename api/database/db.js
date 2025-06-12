import db from "./connection.js";

async function criarTabelas() {
  try {
    await db.query("SET autocommit = 0");

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

    await db.query("COMMIT");
    console.log("Banco resetado com sucesso");
  } catch (e) {
    await db.query("ROLLBACK");
    console.error("Erro ao resetar o banco: ", e);
    process.exit(1);
  } finally {
    await db.query("SET autocommit = 1");
    await db.end();
  }
}

criarTabelas()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
