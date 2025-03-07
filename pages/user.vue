<template>
  <div>
    <Navbar />
    <div class="container-fluid">
      <h5>User Management</h5>
      <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>
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
              <form @submit.prevent="registerUser">
                <div class="mb-3">
                  <label for="username" class="form-label">Nome</label>
                  <input id="username" v-model="newUser.name" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input id="email" v-model="newUser.email" type="email" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Senha</label>
                  <input id="password" v-model="newUser.password" type="password" class="form-control" required>
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
      <div class="row mt-4">
        <div class="col-sm-4 mb-3" v-for="user in users" :key="user.id">
          <div class="card">
            <div class="card-body">
              <p class="card-title"><strong>{{ user.name }}</strong></p>
              <p class="card-text">{{ user.email }}</p>
              <hr>
              <button @click="editUser(user)" class="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight">Editar</button>
              <button @click="deleteUser(user.id)" class="btn btn-danger ms-2">Excluir</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Offcanvas de Edição -->
      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasRightLabel">Atualizar Usuário</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <form @submit.prevent="updateUser">
            <div class="mb-3">
              <label for="edit-username" class="form-label">Nome</label>
              <input id="edit-username" v-model="selectedUser.name" type="text" class="form-control" required>
            </div>
            <div class="mb-3">
              <label for="edit-email" class="form-label">Email</label>
              <input id="edit-email" v-model="selectedUser.email" type="email" class="form-control" required>
            </div>
            <div class="mb-3">
              <label for="edit-password" class="form-label">Senha</label>
              <input id="edit-password" v-model="selectedUser.password" type="password" class="form-control" placeholder="Deixe em branco para manter">
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

<script>
import User from '../server/model/userModel';
import userController from '../server/controller/userController';

definePageMeta({
    middleware: 'auth'
});

export default {
  data() {
    return {
      users: [],
      newUser: new User({}),
      selectedUser: new User({}),
      message: "" // 🔹 Variável para armazenar mensagens de feedback
    };
  },

  async mounted() {
    this.loadUsers();
  },

  methods: {
    async loadUsers() {
      const data = await userController.fetchUsers();
      this.users = data.records.map(user => new User(user)) || [];
    },

    async registerUser() {
      const response = await userController.registerUser(this.newUser);
      
      if (response.success) {
        this.message = "Erro ao cadastrar usuário!";
      } else {
        this.message = "Usuário cadastrado com sucesso!";
      }

      this.newUser = new User({});
      this.loadUsers();
      this.clearMessage();
    },

    editUser(user) {
      this.selectedUser = new User(user);
    },

    async updateUser() {
      const response = await userController.updateUser(this.selectedUser);
      
      if (response.success) {
        this.message = "Erro ao atualizar usuário!";
      } else {
        this.message = "Usuário atualizado com sucesso!";
      }

      this.loadUsers();
      this.clearMessage();
    },

    async deleteUser(id) {
      const response = await userController.deleteUser(id);
      
      if (response.success) {
        this.message = "Erro ao excluir usuário!";
      } else {
        this.message = "Usuário excluído com sucesso!";
      }

      this.loadUsers();
      this.clearMessage();
    },

    clearMessage() {
      setTimeout(() => {
        this.message = "";
      }, 3000);
    }
  }
};
</script>



<style scoped>
h5 {
  margin-top: 65px;
}

.modal-footer {
  margin-top: 20px;
}
</style>
