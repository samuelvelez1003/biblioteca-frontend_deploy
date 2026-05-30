<template>
  <AppLayout>
    <section class="hero">
      <p class="eyebrow">Panel de usuario</p>
      <h1>Mis reservas</h1>
      <p>Consulta tus solicitudes, prestamos aprobados y devoluciones.</p>
    </section>

    <div v-if="!reservas.length" class="empty">No tienes reservas registradas.</div>
    <div class="list">
      <article v-for="r in reservas" :key="r.id" class="row-card">
        <img :src="r.portada || placeholder" />
        <div>
          <h3>{{ r.titulo }}</h3>
          <p>{{ r.autor }}</p>
          <span class="badge">{{ r.estado }}</span>
        </div>
        <div class="actions">
          <button v-if="r.estado === 'pendiente'" class="danger" @click="cancelar(r.id)">Cancelar</button>
          <button v-if="r.estado === 'aprobada'" @click="devolver(r.id)">Solicitar devolucion</button>
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
    return { reservas: [], placeholder: "https://via.placeholder.com/80x110?text=Libro" };
  },
  computed: { headers() { return authHeaders(); } },
  mounted() { this.getReservas(); },
  methods: {
    async getReservas() {
      try {
        const res = await axios.get(`${API}/reservas/mis`, { headers: this.headers });
        this.reservas = Array.isArray(res.data) ? res.data : [];
      } catch (error) {
        console.error("Error cargando mis reservas:", error.response?.data || error.message);
        this.reservas = [];
      }
    },
    async cancelar(id) {
      await axios.delete(`${API}/reservas/${id}`, { headers: this.headers });
      this.getReservas();
    },
    async devolver(id) {
      await axios.put(`${API}/reservas/${id}/devolver`, {}, { headers: this.headers });
      alert("Solicitud de devolucion enviada");
      this.getReservas();
    },
  },
};
</script>
