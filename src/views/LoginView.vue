<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Biblioteca</h1>
      <p>Inicia sesion para continuar</p>

      <input v-model="email" type="email" placeholder="Correo" />
      <input v-model="password" type="password" placeholder="Contraseña" />

      <button @click="login">Ingresar</button>
      <RouterLink to="/registro">Crear una cuenta</RouterLink>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API } from "../services/api";

export default {
  data() {
    return { email: "", password: "" };
  },
  methods: {
    async login() {
      try {
        const res = await axios.post(`${API}/users/login`, {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("name", res.data.name || res.data.username || "Usuario");

        this.$router.push(res.data.role === "admin" ? "/reportes" : "/libros");
      } catch (error) {
        alert(error.response?.data?.message || "Error en login");
      }
    },
  },
};
</script>
