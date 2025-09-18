<template>
  <div class="blog-layout">
    <header class="blog-header">
      <div class="header-content">
        <router-link to="/blog" class="blog-title">
          <h1>我的技術部落格</h1>
        </router-link>
        <nav class="blog-nav">
          <router-link to="/admin" class="admin-link">管理後台</router-link>
        </nav>
      </div>
    </header>

    <main class="blog-main">
      <router-view />
    </main>

    <footer class="blog-footer">
      <p>&copy; 2025 ITHome 2025 部落格. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// BlogApp 負責部落格的整體佈局和導航
</script>

<style scoped>
.blog-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.blog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.blog-title {
  text-decoration: none;
  color: white;
}

.blog-title h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.blog-nav {
  display: flex;
  gap: 20px;
}

.admin-link {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.admin-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.blog-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
}

.blog-footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 20px;
  margin-top: auto;
}

.blog-footer p {
  margin: 0;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
  }

  .blog-title h1 {
    font-size: 1.5rem;
  }

  .blog-main {
    padding: 20px 15px;
  }
}
</style>
