<template>
  <AppLayout>
    <section class="hero">
      <p class="eyebrow">Panel bibliotecario</p>
      <h1>Libros prestados</h1>
      <p>Listado completo de prestamos activos y devueltos.</p>
    </section>

    <div v-if="!prestamos.length" class="empty">No hay prestamos registrados.</div>
    <div class="list">
      <article v-for="p in prestamos" :key="p.id" class="row-card">
        <img :src="p.portada || placeholder" />
        <div>
          <h3>{{ p.titulo }}</h3>
          <p>{{ p.autor }}</p>
          <p><strong>Usuario:</strong> {{ p.usuario }}</p>
          <span class="badge">{{ p.estado }}</span>
        </div>
        <div class="actions">
          <button v-if="p.estado === 'activo'" @click="devolver(p.id)">Marcar devuelto</button>
        </div>
      </article>
    </div>
  </AppLayout>
</template>

<script>
import axios from "axios";
import AppLayout from "../components/AppLayout.vue";
import { API, authHeaders } from "../services/api";

export default {
  components: { AppLayout },
  data() {
    return { prestamos: [], placeholder: "https://via.placeholder.com/80x110?text=Libro" };
  },
  computed: { headers() { return authHeaders(); } },
  mounted() { this.getPrestamos(); },
  methods: {
    async getPrestamos() {
      try {
        const res = await axios.get(`${API}/prestamos`, { headers: this.headers });
        this.prestamos = Array.isArray(res.data) ? res.data : [];
      } catch (error) {
        console.error("Error cargando prestamos:", error.response?.data || error.message);
        this.prestamos = [];
      }
    },
    async devolver(id) {
      await axios.put(`${API}/prestamos/${id}/devolver`, {}, { headers: this.headers });
      alert("Libro marcado como devuelto");
      this.getPrestamos();
    },
  },
};
</script>
