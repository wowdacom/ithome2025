<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 根組件只負責路由渲染
</script>

<style>
/* 全域樣式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-color: #f8f9fa;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}
</style>
