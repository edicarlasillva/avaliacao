import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

const app = express()

/**
 * Dados do usuário
 * -> ID
 * -> Nome
 * -> E-mail
 * -> Senha
 * Dados de um recado
 * -> ID
 * -> Titulo
 * -> Descrição
 * -> UserId
 */

const users = []
const messages = []

app.use(express.json())

// Cadastro de usuário
app.post("/signup", async (request, response) => {
  const { name, email, password } = request.body

  // Verifica se existe algum usuário com esse e-mail
  const emailAlreadyRegistered = users.find(user => user.email === email)

  if (emailAlreadyRegistered) {
    return response.status(400).json({
      message: "E-mail já cadastrado."
    })
  }

  // Encriptando a senha para ficar mais segura
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword // salvando a senha encriptada no array
  }

  users.push(newUser)

  response.status(201).json({
    message: "Conta criada com sucesso.",
    user: newUser
  })
})

// Rota para fazer login
app.post("/login", async (request, response) => {
  const { email, password } = request.body

  const user = users.find(user => user.email === email)

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return response.status(400).json({
      message: "Credenciais inválidas."
    })
  }

  if (!user) {
    return response.status(404).json({
      message: "Usuário não encontrado."
    })
  }

  response.status(200).json({
    message: "Login bem-sucedido!", userId: user.id
  })
})

// Rota para criar um recado
app.post("/messages", (request, response) => {
  const { title, description, userId } = request.body

  const user = users.find(user => user.id === userId)

  if (!user) {
    return response.status(404).json({
      message: "Usuário não encontrado."
    })
  }

  const newMessage = {
    id: uuidv4(),
    title,
    description,
    userId
  }

  messages.push(newMessage)

  response.status(201).json({
    message: "Recado criado com sucesso.",
    newMessage
  })

})

// Rota para listar todos os recados de um usuário específico
app.get("/messages/:userId", (resquest, response) => {
  const { userId } = resquest.params

  const user = users.find(user => user.id === userId)

  if (!user) {
    return response.status(404).json({
      message: "Usuário não encontrado."
    })
  }

  const userMessages = messages.filter(message => message.userId === userId)

  response.status(200).json(userMessages)
})

// Rota para atualizar um recado
app.put("/messages/:messageId", (request, response) => {
  const { messageId } = request.params
  const { title, description } = request.body

  const messageIndex = messages.findIndex(message => message.id === messageId)

  if (messageIndex === -1) {
    return response.status(404).json({
      message: "Recado não encontrado."
    })
  }

  messages[messageIndex].title = title
  messages[messageIndex].description = description

  response.status(200).json({
    message: "Recado atualizado com sucesso."
  })
})

// Rota para excluir um recado
app.delete("/messages/:messageId", (request, response) => {
  const { messageId } = request.params

  const messageIndex = messages.findIndex(message => message.id === messageId)

  if (messageIndex === -1) {
    return response.status(404).json({
      message: "Recado não encontrado."
    })
  }

  const deletedMessage = messages.splice(messageIndex, 1)

  response.status(200).json({
    message: "Recado excluído com sucesso.",
    deletedMessage
  })
})

app.listen(3333, () => console.log("Servidor rodando na porta 3333"))