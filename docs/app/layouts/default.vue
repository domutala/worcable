<script setup lang="ts"></script>

<template>
  <UMain>
    <Container :ui="{ root: 'sticky top-0 z-50', content: 'bg-surface' }">
      <AppHeader />
    </Container>
    <slot />
  </UMain>
  <AppFooter />
</template>
