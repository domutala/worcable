<script setup lang="ts"></script>

<template>
  <UMain>
    <!-- <Container :ui="{ content: 'min-h-8' }"> </Container> -->

    <Container :ui="{ root: 'sticky top-0 z-50', content: 'bg-surface/40' }">
      <AppHeader />
    </Container>
    <slot />
  </UMain>
  <AppFooter />
</template>
