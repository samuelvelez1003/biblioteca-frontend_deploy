<template>
  <div class="app-shell">
    <aside class="sidebar glass-panel">
      <RouterLink class="brand" to="/libros">
        <span class="brand-mark">BP</span>
        <span>
          <strong>Biblioteca Publica Digital</strong>
          <small>Panel {{ roleLabel }}</small>
        </span>
      </RouterLink>

      <div class="profile-card">
        <span class="avatar">{{ initials }}</span>
        <div>
          <small>Bienvenido</small>
          <strong>{{ name }}</strong>
          <em>{{ roleLabel }}</em>
        </div>
      </div>

      <nav class="nav-menu">
        <RouterLink to="/libros">{{ role === 'usuario' ? 'Explorar libros' : 'Gestionar catalogo' }}</RouterLink>
        <RouterLink v-if="role === 'usuario'" to="/mis-reservas">Mis reservas</RouterLink>
        <RouterLink v-if="role === 'bibliotecario'" to="/reservas">Solicitudes</RouterLink>
        <RouterLink v-if="role === 'bibliotecario'" to="/prestamos">Prestamos</RouterLink>
        <RouterLink v-if="role === 'admin'" to="/reportes">Reportes</RouterLink>
      </nav>

      <button class="logout-button" @click="logout">Cerrar sesion</button>
    </aside>

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script>
export default {
  computed: {
    role() {
      return localStorage.getItem('role') || 'usuario';
    },
    name() {
      return localStorage.getItem('name') || 'Usuario';
    },
    roleLabel() {
      const labels = { usuario: 'Usuario', bibliotecario: 'Bibliotecario', admin: 'Administrador' };
      return labels[this.role] || this.role;
    },
    initials() {
      return this.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';
    },
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/');
    },
  },
};
</script>
