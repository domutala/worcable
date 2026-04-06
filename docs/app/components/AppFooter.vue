<script setup lang="ts">
const { footer, links } = useAppConfig();
</script>

<template>
  <UFooter
    class="border-t-0"
    :ui="{
      top: 'border-b border-default py-25',
      container: 'lg:items-start',
      left: 'items-start justify-start',
      right: 'items-start justify-start',
    }"
  >
    <template #top>
      <u-container>
        <div class="flex justify-center flex-wrap mx-auto gap-20">
          <!-- <div class="flex flex-col gap-4 mr-15">
            <NuxtLink :to="$localePath(footer.to)">
              <AppLogo class="w-auto h-6 shrink-0" />
            </NuxtLink>
          </div> -->

          <div
            v-for="(group, g) in footer.groups"
            :key="g"
            class="flex flex-col gap-4"
          >
            <div class="text-sm opacity-50 mb-1">
              {{ $t(group.title) }}
            </div>
            <nuxt-link
              v-for="(link, l) in group.links"
              v-bind="link"
              :key="l"
              :to="link.to ? $localePath(link.to) : undefined"
            >
              {{ $t(link.label) }}
            </nuxt-link>
          </div>
        </div>
      </u-container>
    </template>

    <template #left>
      <div class="flex items-center gap-2">
        <div class="flex flex-col gap-2">
          <NuxtLink :to="$localePath(footer.to)" class="block">
            <AppLogo class="w-auto h-6 shrink-0" />
          </NuxtLink>

          <div class="flex flex-wrap gap-1">
            <UButton
              v-for="(link, index) of links"
              :key="index"
              class="rounded-none border border-default"
              v-bind="{ color: 'neutral', variant: 'soft', ...link }"
            />
          </div>

          <div class="mt-3">
            © {{ new Date().getFullYear() }}

            <u-link
              to="https://domutala.netlify.app"
              target="_blank"
              class="font-bold text-highlighted underline"
            >
              domutala
            </u-link>
          </div>
        </div>
      </div>
    </template>

    <template #right>
      <AppLocale />
      <AppTheme />
    </template>
  </UFooter>
</template>
