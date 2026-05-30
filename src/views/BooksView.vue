<template>
  <AppLayout>
    <section class="hero">
      <p class="eyebrow">{{ roleLabel }}</p>
      <h1>{{ welcomeTitle }}</h1>
      <p>{{ welcomeText }}</p>
    </section>

    <div v-if="role === 'admin'" class="notice">
      El administrador solo consulta el catalogo y genera reportes. No puede reservar ni pedir libros prestados.
    </div>

    <section class="toolbar">
      <input v-model="localSearch" placeholder="Filtrar libros guardados..." />
      <input v-model="externalSearch" @input="searchExternal" placeholder="Buscar en Open Library..." />
    </section>

    <section v-if="externalBooks.length" class="section">
      <div class="section-title">
        <h2>Resultados de Open Library</h2>
      </div>

      <div class="grid">
        <article v-for="book in externalBooks" :key="`${book.titulo}-${book.isbn || book.anio}`" class="card">
          <img :src="book.portada || placeholder" class="cover" />
          <div class="card-body">
            <h3>{{ book.titulo }}</h3>
            <p>{{ book.autor }}</p>
            <small>{{ book.anio || 'Sin año' }}</small>

            <button v-if="role === 'bibliotecario'" @click="saveBook(book)">
              Guardar en biblioteca
            </button>

            <button v-if="role === 'usuario'" @click="reserveExternalBook(book)">
              Reservar este libro
            </button>

            <small v-if="role === 'admin'">Vista de consulta administrativa</small>
          </div>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-title">
        <h2>{{ role === 'usuario' ? 'Libros disponibles para reservar' : 'Catalogo guardado' }}</h2>
      </div>

      <div v-if="!filteredBooks.length" class="empty">No hay libros guardados todavia.</div>
      <div class="grid">
        <article v-for="book in filteredBooks" :key="book._id" class="card">
          <img :src="book.portada || placeholder" class="cover" />
          <div class="card-body">
            <h3>{{ book.titulo }}</h3>
            <p>{{ book.autor }}</p>
            <small>{{ book.categoria || 'General' }} | Disponibles: {{ book.cantidad }}</small>
            <button v-if="role === 'usuario'" :disabled="book.cantidad <= 0" @click="reserveBook(book)">
              {{ book.cantidad > 0 ? 'Reservar' : 'Sin disponibilidad' }}
            </button>
            <small v-else>Gestion visible segun rol. Los prestamos se administran desde el panel correspondiente.</small>
          </div>
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
      books: [],
      externalBooks: [],
      localSearch: "",
      externalSearch: "",
      timeout: null,
      placeholder: "https://via.placeholder.com/220x300?text=Libro",
      role: localStorage.getItem("role"),
      name: localStorage.getItem("name") || "Usuario",
    };
  },
  computed: {
    headers() {
      return authHeaders();
    },
    roleLabel() {
      const labels = { usuario: "Usuario", bibliotecario: "Bibliotecario", admin: "Administrador" };
      return labels[this.role] || this.role;
    },
    welcomeTitle() {
      if (this.role === "admin") return `Bienvenido, ${this.name}`;
      if (this.role === "bibliotecario") return `Bienvenido, ${this.name}`;
      return `Bienvenido, ${this.name}`;
    },
    welcomeText() {
      if (this.role === "admin") return "Consulta el catalogo y revisa los reportes generales de la biblioteca desde tu panel administrativo.";
      if (this.role === "bibliotecario") return "Busca nuevos titulos, guarda libros en el catalogo y controla solicitudes y prestamos.";
      return "Explora libros, envia reservas y consulta el estado de tus solicitudes desde tu panel personal.";
    },
    filteredBooks() {
      const term = this.localSearch.toLowerCase();
      return this.books.filter((b) => [b.titulo, b.autor, b.categoria].join(" ").toLowerCase().includes(term));
    },
  },
  mounted() {
    this.loadBooks();
  },
  methods: {
    async loadBooks() {
      try {
        const res = await axios.get(`${API}/libros`, { headers: this.headers });
        this.books = Array.isArray(res.data) ? res.data : [];
      } catch (error) {
        console.error("Error al cargar libros:", error.response?.data || error.message);
        this.books = [];
        alert(error.response?.data?.message || "Error al cargar libros. Revisa que el backend y MongoDB esten activos.");
      }
    },
    searchExternal() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.fetchExternalBooks, 500);
    },
    async fetchExternalBooks() {
      if (this.externalSearch.trim().length < 3) {
        this.externalBooks = [];
        return;
      }
      try {
        const res = await axios.get(`${API}/libros/buscar?q=${encodeURIComponent(this.externalSearch)}`, { headers: this.headers });
        this.externalBooks = Array.isArray(res.data) ? res.data : [];
      } catch (error) {
        console.error("Error buscando en Open Library:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Error buscando en Open Library");
      }
    },
    async saveBook(book) {
      try {
        await axios.post(`${API}/libros/guardar-openlibrary`, book, { headers: this.headers });
        alert("Libro guardado");
        this.loadBooks();
      } catch (error) {
        alert(error.response?.data?.message || "Error al guardar libro");
      }
    },
    async reserveBook(book) {
      try {
        await axios.post(`${API}/reservas`, { libro_id: book._id }, { headers: this.headers });
        alert("Reserva enviada. Un bibliotecario debe aprobar el prestamo.");
        this.loadBooks();
      } catch (error) {
        alert(error.response?.data?.message || "Error al reservar");
      }
    },
    async reserveExternalBook(book) {
      try {
        await axios.post(`${API}/reservas/openlibrary`, book, { headers: this.headers });
        alert("Libro guardado y reserva enviada. Un bibliotecario debe aprobar el prestamo.");
        this.externalBooks = [];
        this.externalSearch = "";
        this.loadBooks();
      } catch (error) {
        alert(error.response?.data?.message || "Error al reservar libro");
      }
    },
  },
};
</script>
