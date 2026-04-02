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
      <MDC :value="footer.credits" unwrap="p" />
    </template>

    <template #right>
      <AppLocale />
      <AppTheme v-if="footer?.colorMode" />

      <!-- <template v-if="footer?.links">
          <UButton
            v-for="(link, index) of footer?.links"
            :key="index"
            v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
          />
        </template> -->
    </template>
  </UFooter>
</template>
