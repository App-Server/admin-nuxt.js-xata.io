import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createLogger, transports, format } from 'winston';
import sanitizeHtml from 'sanitize-html';

// Configuração do logger
const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [new transports.Console()],
});

// Configurações da API
const API_URL = "https://app-developer-s-workspace-6anock.us-east-1.xata.sh/db/database-cloud:main/tables/user/";
const AUTH_HEADER = {
  Authorization: `Bearer xau_SwwqT9R2RFkVmi3rrvfY6xBQnNqPD02R1`,
  "Content-Type": "application/json",
};
const JWT_SECRET = process.env.JWT_SECRET;

// Funções de validação e sanitização
const validateInput = (input) => {
  if (!input || typeof input !== 'string') {
    throw new Error('Entrada inválida.');
  }
  return input.trim();
};

const sanitizeInput = (input) => {
  return sanitizeHtml(input, {
    allowedTags: [], // Não permite nenhuma tag HTML
    allowedAttributes: {}, // Não permite nenhum atributo
  });
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('E-mail inválido.');
  }
  return email;
};

const validatePassword = (password) => {
  if (password.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres.');
  }
  return password;
};

// Função para gerar hash da senha
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Função para gerar token JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '10000000000000000h' });
};

// Função para autenticar token JWT
const authenticate = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido ou expirado.');
  }
};

// Função para fazer requisições à API externa
const fetchAPI = async (url, options) => {
  try {
    const response = await fetch(url, { headers: AUTH_HEADER, ...options });
    return await response.json();
  } catch (error) {
    logger.error(`Erro na requisição: ${error.message}`);
    return { success: false, message: "An error occurred.", error };
  }
};

// Handler principal do endpoint
export default defineEventHandler(async (event) => {
  const { method } = event.req;
  const body = method !== "DELETE" ? await readBody(event) : null;
  const query = method === "DELETE" ? getQuery(event) : null;

  logger.info(`Requisição recebida: ${method} ${event.req.url}`, {
    ip: event.req.headers['x-forwarded-for'] || event.req.connection.remoteAddress,
    userId: event.context.user?.id || 'N/A',
  });

  switch (method) {
    case "POST":
      if (body.action === "register") {
        try {
          // Valida e sanitiza os dados
          const validatedName = validateInput(body.name);
          const validatedEmail = validateEmail(body.email);
          const validatedPassword = validatePassword(body.password);

          const sanitizedName = sanitizeInput(validatedName);
          const sanitizedEmail = sanitizeInput(validatedEmail);
          const hashedPassword = await hashPassword(validatedPassword);

          // Faz a requisição para a API externa
          const data = await fetchAPI(`${API_URL}data?columns=id`, {
            method: "POST",
            body: JSON.stringify({ name: sanitizedName, email: sanitizedEmail, password: hashedPassword })
          });

          if (data.id) {
            const user = { id: data.id, name: sanitizedName, email: sanitizedEmail };
            const token = generateToken(user); // Gera o token JWT
            return { success: true, message: "Successfully registered!", token, user };
          } else {
            return { success: false, message: "Registration failed." };
          }
        } catch (error) {
          logger.error(`Erro no registro: ${error.message}`);
          return { success: false, message: error.message };
        }
      }

      if (body.action === "fetchUsers") {
        const token = event.req.headers['authorization']?.split(' ')[1];
        if (!token) {
          return { success: false, message: 'Token de autenticação não fornecido.' };
        }

        try {
          authenticate(token); // Verifica o token
          const data = await fetchAPI(`${API_URL}query`, {
            method: "POST",
            body: JSON.stringify({ columns: ["id", "name", "email"], page: { size: 50 } })
          });
          return { success: true, users: data.records };
        } catch (error) {
          logger.error(`Erro ao buscar usuários: ${error.message}`);
          return { success: false, message: error.message };
        }
      }
      break;

    case "PATCH":
      if (!body.id) return { success: false, message: "User ID is required." };

      const token = event.req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return { success: false, message: 'Token de autenticação não fornecido.' };
      }

      try {
        authenticate(token); // Verifica o token
        const updateData = { name: body.name, email: body.email };
        if (body.password?.trim()) {
          updateData.password = await hashPassword(body.password);
        }

        const patchData = await fetchAPI(`${API_URL}data/${body.id}?columns=id`, {
          method: "PATCH",
          body: JSON.stringify(updateData)
        });
        return patchData.id
          ? { success: true, message: "Successfully updated!", data: patchData }
          : { success: false, message: "Update failed." };
      } catch (error) {
        logger.error(`Erro ao atualizar usuário: ${error.message}`);
        return { success: false, message: error.message };
      }

    case "DELETE":
      if (!query?.id) return { success: false, message: "User ID is required." };

      const deleteToken = event.req.headers['authorization']?.split(' ')[1];
      if (!deleteToken) {
        return { success: false, message: 'Token de autenticação não fornecido.' };
      }

      try {
        authenticate(deleteToken); // Verifica o token
        const deleteData = await fetchAPI(`${API_URL}data/${query.id}?columns=id`, { method: "DELETE" });
        return deleteData.id
          ? { success: true, message: "Successfully deleted!" }
          : { success: false, message: "Deletion failed." };
      } catch (error) {
        logger.error(`Erro ao excluir usuário: ${error.message}`);
        return { success: false, message: error.message };
      }

    default:
      return { success: false, message: "Invalid request." };
  }
});