<template>
  <div class="auth-page">
    <div class="auth-card wide">
      <h1>Registro</h1>
      <p>Crea una cuenta nueva y selecciona el rol que necesitas para probar el sistema.</p>

      <input v-model="form.name" placeholder="Nombre completo" />
      <input v-model="form.username" placeholder="Nombre de usuario" />
      <input v-model="form.email" type="email" placeholder="Correo" />
      <input v-model="form.password" type="password" placeholder="Contraseña" />

      <label class="field-label">Rol</label>
      <select v-model="form.role">
        <option value="usuario">Usuario: buscar libros y hacer reservas</option>
      </select>

      <button @click="register" :disabled="loading">
        {{ loading ? "Registrando..." : "Registrar" }}
      </button>

      <RouterLink to="/">Volver al login</RouterLink>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API } from "../services/api";

export default {
  data() {
    return {
      loading: false,
      form: {
        name: "",
        username: "",
        email: "",
        password: "",
        role: "usuario",
      },
    };
  },
  methods: {
    async register() {
      if (!this.form.name || !this.form.email || !this.form.password) {
        alert("Nombre, correo y contraseña son obligatorios");
        return;
      }

      try {
        this.loading = true;
        await axios.post(`${API}/users/register`, this.form);
        alert("Usuario registrado. Ahora puedes iniciar sesion.");
        this.$router.push("/");
      } catch (error) {
        alert(error.response?.data?.message || "Error al registrar");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
