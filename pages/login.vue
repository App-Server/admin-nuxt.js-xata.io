<template>
    <div class="front-form">
        <div class="container d-flex justify-content-center">
            <div class="card col-sm-4 ">
                <div class="card-body ">
                    <form @submit.prevent="handleLogin">
                        <p v-if="error" class="text-danger">{{ error }}</p>
                        <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email</label>
                        <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required>
                        </div>
                        <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Senha</label>
                        <input v-model="password" type="password" class="form-control" id="exampleInputPassword1" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.front-form {
    margin-top: 250px;
}

body {
  background-color: #f5f6ff !important;
}

</style>
  
<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useFetch } from '#app'
  import { useCookie } from '#imports'
  
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const router = useRouter()
  
  const handleLogin = async () => {
    try {
      const response = await useFetch('/api/auth/login', {
        method: 'POST',
        body: { email: email.value, password: password.value }
      })
  
      if (!response.data.value) {
        throw new Error('Erro ao fazer login')
      }
  
      // Armazena o token em um cookie
      useCookie('authToken').value = response.data.value.token
      router.push('/painel')
    } catch (err) {
      error.value = err.message || 'Erro ao fazer login'
    }
  };
</script>
  