<template>
  <div>
    <Navbar />
    <div class="container">
      <h5>User Management</h5>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Novo Usuário
      </button>

      <!-- Modal de Cadastro -->
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Cadastrar Novo Usuário</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="register">
                <div>
                  <label for="username" class="form-label">Username</label>
                  <input id="username" v-model="name" type="text" class="form-control" required>
                </div>
                <div>
                  <label for="email" class="form-label">Email</label>
                  <input id="email" v-model="email" type="email" class="form-control" required>
                </div>
                <div>
                  <label for="password" class="form-label">Password</label>
                  <input id="password" v-model="password" type="password" class="form-control" required>
                </div>
                <div class="modal-footer">
                  <button type="submit" class="btn btn-primary">Cadastrar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Listagem de Usuários -->
      <br><br>
      
      <div class="row">
        <div class="col-sm-4 mb-3 mb-sm-3" v-for="user in users" :key="user.id">
          <div class="card">
            <div class="card-body">
              <p class="card-title">{{ user.name }}</p>
              <p class="card-text">{{ user.email }}</p>
              <hr>
              <button @click="loadUser(user.id)" class="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight">Edit</button>
              <button @click="deleteUser(user.id)" class="btn btn-danger" style="margin-left: 5px;">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Offcanvas de Edição -->
      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasRightLabel">Atualizar Cadastro</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <form @submit.prevent="updateUser">
            <div>
              <label for="edit-username" class="form-label">Username</label>
              <input id="edit-username" v-model="editUser.name" type="text" class="form-control" required>
            </div>
            <div>
              <label for="edit-email" class="form-label">Email</label>
              <input id="edit-email" v-model="editUser.email" type="email" class="form-control" required>
            </div>
            <div>
              <label for="edit-password" class="form-label">Password</label>
              <input id="edit-password" v-model="editUser.password" type="password" class="form-control">
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">Atualizar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h5 {
    margin-top: 65px;
}

.modal-footer {
    margin-top: 20px;
}

</style>

<script>
export default {
  definePageMeta: {
    middleware: 'auth'
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      users: [],
      currentUserId: null,
      editUser: {
        name: '',
        email: '',
        password: ''
      },
      status: '',
      success: false
    };
  },
  methods: {
    async register() {
      if (!this.name || !this.email || !this.password) {
        alert("Todos os campos são obrigatórios!");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        alert("Email inválido!");
        return;
      }

      if (this.password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres!");
        return;
      }

      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: this.name.trim(),
          email: this.email.trim(),
          password: this.password
        })
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token); // Armazena o token
        //console.log('Token salvo:', data.token); // Log do token
        this.fetchUsers(); // Carrega os usuários após o registro
        this.resetForm();
        this.closeModal('exampleModal');
      } else {
        alert("Erro ao cadastrar usuário!");
      }
    },

    async fetchUsers() {
      try {
        const token = localStorage.getItem('token'); // Recupera o token
        if (!token) {
          console.error('Token não encontrado.');
          alert('Token não encontrado. Faça login novamente.');
          return;
        }

        //console.log('Token enviado:', token); // Log do token enviado

        const response = await fetch('/api/user', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Envia o token
          },
          body: JSON.stringify({ action: 'fetchUsers' })
        });

        const data = await response.json();
        //console.log('Resposta da API:', data); // Log da resposta

        if (data.success) {
          this.users = data.users;
          //console.log('Usuários carregados:', this.users); // Log dos usuários
        } else {
          console.error('Erro ao carregar usuários:', data.message);
          alert('Erro ao carregar usuários: ' + data.message);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro na requisição: ' + error.message);
      }
    },

    async updateUser() {
      const token = localStorage.getItem('token'); // Recupera o token
      if (!token) {
        console.error('Token não encontrado.');
        alert('Token não encontrado. Faça login novamente.');
        return;
      }

      const payload = {
        id: this.currentUserId,
        name: this.editUser.name,
        email: this.editUser.email
      };

      if (this.editUser.password.trim()) {
        payload.password = this.editUser.password;
      }

      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Envia o token
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        this.fetchUsers();
        this.resetForm();
        this.closeModal('offcanvasRight'); 
      }
    },

    async deleteUser(userId) {
      if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

      const token = localStorage.getItem('token'); // Recupera o token
      if (!token) {
        console.error('Token não encontrado.');
        alert('Token não encontrado. Faça login novamente.');
        return;
      }

      const response = await fetch(`/api/user?id=${userId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}` // Envia o token
        }
      });

      const data = await response.json();
      if (data.success) {
        this.fetchUsers();
      }
    },

    async loadUser(userId) {
      const user = this.users.find(user => user.id === userId);
      if (user) {
        this.currentUserId = user.id;
        this.editUser = { name: user.name, email: user.email, password: '' };
      }
    },

    resetForm() {
      this.name = '';
      this.email = '';
      this.password = '';
      this.currentUserId = null;
    },

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) modalInstance.hide();
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>
