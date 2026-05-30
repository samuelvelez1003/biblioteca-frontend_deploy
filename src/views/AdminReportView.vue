<template>
  <AppLayout>
    <section class="hero">
      <p class="eyebrow">Panel administrador</p>
      <h1>Reporte Administrativo</h1>
      <p>Bienvenido, {{ name }}. Revisa indicadores generales y descarga el resumen en PDF. Este rol no puede reservar ni pedir libros prestados.</p>
    </section>

    <div class="stats">
      <div class="stat"><strong>{{ total.total }}</strong><span>Total prestados</span></div>
      <div class="stat"><strong>{{ total.activos }}</strong><span>Activos</span></div>
      <div class="stat"><strong>{{ total.devueltos }}</strong><span>Devueltos</span></div>
    </div>

    <button @click="downloadPdf">Descargar reporte PDF</button>

    <section class="section">
      <div class="section-title">
        <h2>Libros mas prestados</h2>
      </div>
      <div v-if="!top.length" class="empty">Todavia no hay datos.</div>
      <div class="list">
        <article v-for="book in top" :key="book._id" class="row-card compact">
          <div>
            <h3>{{ book.titulo }}</h3>
            <p>{{ book.autor }}</p>
          </div>
          <strong>{{ book.total_prestamos }} prestamos</strong>
        </article>
      </div>
    </section>
  </AppLayout>
</template>

<script>
import axios from "axios";
import AppLayout from "../components/AppLayout.vue";
import { API, authHeaders } from "../services/api";

export default {
  components: { AppLayout },
  data() {
    return {
      total: { total: 0, activos: 0, devueltos: 0 },
      top: [],
      name: localStorage.getItem("name") || "Administrador",
    };
  },
  computed: { headers() { return authHeaders(); } },
  mounted() { this.loadReport(); },
  methods: {
    async loadReport() {
      try {
        const [totalRes, topRes] = await Promise.all([
          axios.get(`${API}/reportes/total`, { headers: this.headers }),
          axios.get(`${API}/reportes/top-libros`, { headers: this.headers }),
        ]);
        this.total = totalRes.data || { total: 0, activos: 0, devueltos: 0 };
        this.top = Array.isArray(topRes.data) ? topRes.data : [];
      } catch (error) {
        console.error("Error cargando reportes:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Error al cargar reportes");
      }
    },
    async downloadPdf() {
      try {
        const res = await axios.get(`${API}/reportes/pdf`, { headers: this.headers, responseType: "blob" });
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "reporte-prestamos.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error generando PDF:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Error generando PDF");
      }
    },
  },
};
</script>
