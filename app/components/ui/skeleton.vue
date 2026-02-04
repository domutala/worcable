<template>
  <div class="ui-skeleton relative overflow-hidden">
    <div
      :style="{ animationDelay: `${Math.random() * (5 - 1) + 1}sff` }"
      class="absolute inset-0 bg-surface/35 z-0"
    ></div>
    <!-- bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 -->
    <slot />
  </div>
</template>

<style scoped lang="scss">
@keyframes skeleton {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.ui-skeleton {
  > div {
    animation: skeleton 4s linear infinite alternate;
  }
}
</style>
