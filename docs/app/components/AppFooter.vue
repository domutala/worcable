<script setup lang="ts">
const { footer } = useAppConfig();
</script>

<template>
  <UFooter class="border-t-0" :ui="{ top: 'border-b border-default' }">
    <template #top>
      <u-container class="flex justify-center">
        <div class="py- flex mx-auto gap-20 flex-wrap">
          <div class="flex flex-col gap-4 mr-15">
            <NuxtLink to="/">
              <AppLogo class="w-auto h-6 shrink-0" />
            </NuxtLink>
          </div>

          <div class="flex flex-col gap-4">
            <div class="text-sm opacity-50 mb-1">
              {{ "foot.about.title" }}
            </div>
            <nuxt-link href="https://domutala.netlify.app" target="_blank">
              @domutala
            </nuxt-link>
            <nuxt-link>
              {{ "foot.about.why_open_source" }}
            </nuxt-link>
          </div>

          <div class="flex flex-col gap-4">
            <div class="text-sm opacity-50 mb-1">
              {{ "foot.ressources.title" }}
            </div>

            <nuxt-link
              v-for="item in [
                'Roadmap',
                'Pricing',
                'Contact support',
                'Feature Requests',
              ]"
              :key="item"
            >
              {{ item }}
            </nuxt-link>
          </div>

          <div class="flex flex-col gap-4">
            <div class="text-sm opacity-50 mb-1">
              {{ "foot.legal.title" }}
            </div>
            <nuxt-link>
              {{ "foot.legal.licence" }}
            </nuxt-link>

            <nuxt-link>
              {{ "foot.legal.sscurity" }}
            </nuxt-link>

            <nuxt-link>
              {{ "foot.legal.terms_of_service" }}
            </nuxt-link>
          </div>
        </div>
      </u-container>
    </template>

    <template #left>
      <div class="flex items-center gap-2">
        © {{ new Date().getFullYear() }}

        <u-link
          to="https://domutala.netlify.app"
          target="_blank"
          class="font-bold text-highlighted underline"
        >
          domutala
        </u-link>
      </div>
    </template>

    <template #right>
      <AppLocale />
      <AppTheme v-if="footer?.colorMode" />
    </template>
  </UFooter>
</template>
