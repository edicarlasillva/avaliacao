import express from 'express';

const app = express();

// const users = [
//   {
//     id: 1, nome: "Carla", ativo: true
//   },
//   {
//     id: 2, nome: "Matheus", ativo: false
//   },
//   {
//     id: 3, nome: "Amanda", ativo: true
//   }
// ]

// app.get("/", (request, response) => {
//   const { filtro } = request.query

//   let filteredUsers = users;

//   if (filtro === 'ativo') {
//     filteredUsers = filteredUsers.filter(user => user.ativo === true)
//   } else if (filtro === 'inativo') {
//     filteredUsers = filteredUsers.filter(user => user.ativo === false)
//   }

//   response.status(200).json(filteredUsers);
// })

const myLogger = (request, response, next) => {
  console.log("Logado")
  next();
}

// app.use(myLogger);

app.get("/", myLogger, (request, response) => {
  response.json("Hello, User!")
})

app.listen(3333, () => console.log("Servidor rodando na porta 3333"));