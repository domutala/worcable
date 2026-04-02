<script setup lang="ts"></script>

<template>
  <div
    class="min-h- relative flex flex-col dark:bg-linear-to-b from-neutral-900 to-neutral-950"
  >
    <u-container
      class="flex flex-col items-center justify-center pt-18 md:pb-24 pb-18 max-md:px-6 dark"
    >
      <h1
        class="leading-[1.2] max-w-200 text-center"
        style="letter-spacing: -0.02em; font-size: max(2.5rem, min(4vw, 4rem))"
      >
        <slot name="title" />
      </h1>

      <div
        class="flex items-center gap-2 sm:flex-row flex-col justify-center mt-10"
      >
        <slot name="links" />
      </div>
    </u-container>

    <!-- <div class="max-w-350 relative lg:mx-auto mx-4 mb-5 pointer-events-none">
      <div
        class="overflow-hidden md:rounded-3xl rounded-[10px] ring ring-primary/50 shadow-xl"
      >
        <img
          src="/images/screenshot_desktop_light.jpeg"
          class="w-full h- block select-none object-cover object-top bg-background-main dark:hidden"
        />
        <img
          src="/images/screenshot_desktop_dark.png"
          class="w-full h- block select-none object-cover object-top bg-background-main light:hidden"
        />
      </div>
    </div> -->

    <div
      class="mt-auto mb-15 rotate--45 origin-bottom mx-auto w-120 max-w-[90%] shadow-xl ring-1 ring-default rounded-3xl overflow-auto pb-1 block md:hidden"
    >
      <img
        src="/images/screenshot_mobile_light.jpeg"
        class="mt-auto object-cover object-top border-default dark:hidden"
      />
      <img
        src="/images/screenshot_mobile_dark.png"
        class="mt-auto object-cover object-top border-default light:hidden"
      />
    </div>

    <div
      class="mt-auto mb-15 rotate--45 origin-bottom mx-auto max-w-400 w-11/12 shadow-xl ring-1 ring-default rounded-2xl overflow-auto pb-1 hidden md:block"
    >
      <div class="py-2 flex items-center gap-2 px-5 border-b border-default">
        <div class="size-3 rounded-full bg-green-500"></div>
        <div class="size-3 rounded-full bg-yellow-500"></div>
        <div class="size-3 rounded-full bg-red-500"></div>
      </div>

      <img
        src="/images/screenshot_desktop_light.jpeg"
        class="mt-auto object-cover object-top border-default dark:hidden"
      />
      <img
        src="/images/screenshot_desktop_dark.png"
        class="mt-auto object-cover object-top border-default light:hidden"
      />
    </div>
  </div>
</template>
