import db from "./connection.js";

async function criarTabelas() {
  try {
    const sql = `
      drop table if exists conversa;
      drop table if exists mensagem;
      drop table if exists usuario;

      create table usuario (
        ID_USUARIO int primary key auto_increment,
        NOME varchar(50) not null,
        EMAIL varchar(255) not null unique,
        SENHA varchar(16) not null
      ) engine=innodb default charset=latin1;

      create table conversa (
        ID_CONVERSA int primary key auto_increment,
        ID_USUARIO1 int,
        ID_USUARIO2 int,
        DATA_CRIACAO timestamp,
        foreign key (ID_USUARIO1) references usuario(ID_USUARIO),
        foreign key (ID_USUARIO2) references usuario(ID_USUARIO)
      ) engine=innodb default charset=latin1;

      create table mensagem (
        ID_MENSAGEM int primary key auto_increment,
        CONTEUDO text not null,
        HORA_ENVIO time default current_time(),
        ID_CONVERSA int,
        ID_USUARIO int, 
        foreign key (ID_CONVERSA) references conversa(ID_CONVERSA),
        foreign key (ID_USUARIO) references usuario(ID_USUARIO)
      ) engine=innodb default charset=latin1;
    `;

    db.query(sql);
    console.log("Banco resetado com sucesso");
  } catch (e) {
    console.log("Erro ao reseta o banco: ", e.message);
  }
}

criarTabelas();
