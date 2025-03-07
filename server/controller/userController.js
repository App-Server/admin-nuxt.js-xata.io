const API_URL = 'https://app-6anock.us-east-1.xata.sh/db/database-cloud:main/tables/user';

const headers = {
  'Authorization': `Bearer xau_SwwqT9R2RFkVmi3rrvfY6xBQnNqPD02R1`,
  'Content-Type': 'application/json'
};

// Funções de validação
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function isValidPassword(password) {
  return password.length >= 8;
}

export default {
  // Buscar todos os usuários
  async fetchUsers() {
    try {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ columns: ['id', 'name', 'email'] })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch users: ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching users:', error.message);
      return null;
    }
  },

  // Registrar um novo usuário
  async registerUser(user) {
    try {
      // Validação de entrada
      if (!isValidEmail(user.email)) {
        throw new Error('Invalid email format');
      }
      if (!isValidPassword(user.password)) {
        throw new Error('Password must be at least 8 characters long');
      }

      const response = await fetch(`${API_URL}/data`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password // Certifique-se que este campo existe no Xata
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to register user: ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error registering user:', error.message);
      return null;
    }
  },

  // Atualizar detalhes de um usuário
  async updateUser(user) {
    if (!user.id) {
      console.error("User ID is required for update.");
      return null;
    }

    try {
      // Validação de entrada
      if (user.email && !isValidEmail(user.email)) {
        throw new Error('Invalid email format');
      }

      const response = await fetch(`${API_URL}/data/${user.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ name: user.name, email: user.email })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      return data;
    } catch (error) {
      console.error('Error updating user:', error.message);
      return null;
    }
  },

  // Excluir um usuário
  async deleteUser(userId) {
    if (!userId) {
      console.error("User ID is required for deletion.");
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/data/${userId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete user: ${errorText}`);
      }

      return { message: "User deleted successfully" };
    } catch (error) {
      console.error('Error deleting user:', error.message);
      return null;
    }
  }
};