<template>
  <AppLayout>
    <section class="hero">
      <p class="eyebrow">Panel bibliotecario</p>
      <h1>Solicitudes de prestamo</h1>
      <p>Aprueba reservas pendientes y confirma devoluciones solicitadas por los usuarios.</p>
    </section>

    <div v-if="!reservas.length" class="empty">No hay reservas pendientes o registradas.</div>
    <div class="list">
      <article v-for="r in reservas" :key="r.id" class="row-card">
        <img :src="r.portada || placeholder" />
        <div>
          <h3>{{ r.titulo }}</h3>
          <p>{{ r.autor }}</p>
          <p><strong>Usuario:</strong> {{ r.nombre }}</p>
          <span class="badge">{{ r.estado }}</span>
        </div>
        <div class="actions">
          <button v-if="r.estado === 'pendiente'" @click="aprobar(r.id)">Aprobar</button>
          <button v-if="r.estado === 'devolucion_solicitada'" @click="confirmarDevolucion(r.id)">Confirmar devolucion</button>
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
        const res = await axios.get(`${API}/reservas`, { headers: this.headers });
        this.reservas = Array.isArray(res.data) ? res.data : [];
      } catch (error) {
        console.error("Error cargando reservas:", error.response?.data || error.message);
        this.reservas = [];
      }
    },
    async aprobar(id) {
      await axios.put(`${API}/reservas/${id}/aprobar`, {}, { headers: this.headers });
      alert("Prestamo aprobado");
      this.getReservas();
    },
    async confirmarDevolucion(id) {
      await axios.put(`${API}/reservas/${id}/confirmar-devolucion`, {}, { headers: this.headers });
      alert("Devolucion confirmada");
      this.getReservas();
    },
  },
};
</script>
