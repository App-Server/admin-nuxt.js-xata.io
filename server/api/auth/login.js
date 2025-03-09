import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    const response = await fetch(`${process.env.XATA_DATABASE_URL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.XATA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: { email }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro ao acessar Xata:', response.status, errorText)
      throw createError({ statusCode: 500, message: 'Erro ao acessar o banco de dados' })
    }

    const data = await response.json()
    console.log('Resposta do Xata:', JSON.stringify(data, null, 2)) // Log formatado para depuração

    // Verifica se o usuário existe
    const user = data.records?.[0]
    if (!user) {
      throw createError({ statusCode: 401, message: 'Usuário não encontrado' })
    }

    // Comparação direta de senha sem bcrypt (somente temporário)
    if (password.trim() !== (user.password || '').trim()) {
      throw createError({ statusCode: 401, message: 'Senha incorreta' })
    }

    if (!process.env.JWT_SECRET) {
      throw createError({ statusCode: 500, message: 'Configuração do servidor inválida (JWT_SECRET ausente)' })
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    return { token, user: { id: user.id, email: user.email } }
  } catch (error) {
    console.error('Erro no login:', error)
    throw createError({ statusCode: 500, message: error.message || 'Erro interno no servidor' })
  }
})
