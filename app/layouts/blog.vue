<script lang="ts" setup></script>

<template>
  <ui-layout>
    <UMain>
      <UContainer>
        <UPage>
          <!-- <template #left>
          <UPageAside>
            <UContentNavigation
              :key="$route.path"
              :collapsible="false"
              highlight
              :ui="{
                linkTrailingBadge: 'font-semibold uppercase',
              }"
            />
          </UPageAside>
        </template> -->

          <slot />
        </UPage>
      </UContainer>
    </UMain>
  </ui-layout>
</template>
