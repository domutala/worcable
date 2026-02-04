<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Editor } from "@tiptap/vue-3";

const { editor } = defineProps<{ editor: Editor }>();

const active = computed(() => {
  const headings = [
    editor.isActive("heading", { level: 1 }),
    editor.isActive("heading", { level: 2 }),
    editor.isActive("heading", { level: 3 }),
    editor.isActive("heading", { level: 4 }),
    editor.isActive("heading", { level: 5 }),
    editor.isActive("heading", { level: 6 }),
  ];

  const active = headings.findIndex((k) => k);

  if (active === -1) return;
  return active + 1;
});

const items = computed(() => {
  const items: DropdownMenuItem[] = Array.from({ length: 6 }, (_, i) => {
    return {
      icon: `i-lucide-heading-${i + 1}`,
      label: `Heading ${i + 1}`,
      color: active.value === i ? "primary" : "neutral",
      onSelect(e) {
        editor
          .chain()
          .focus()
          .toggleHeading({ level: i as any })
          .run();
      },
    };
  });

  return items;
});

const icon = computed(() => {
  if (active.value) return `i-lucide-heading-${active.value + 1}`;
  return "i-lucide-heading";
});
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton
      :icon="icon"
      :color="active ? 'primary' : 'neutral'"
      variant="ghost"
      class="cursor-pointer"
    />
  </UDropdownMenu>
</template>

<style>
@reference "tailwindcss";

.ui-editor h1 {
  @apply text-4xl font-bold mt-6 mb-4;
}

.ui-editor h2 {
  @apply text-3xl font-semibold mt-5 mb-3;
}

.ui-editor h3 {
  @apply text-2xl font-semibold mt-4 mb-2;
}

.ui-editor h4 {
  @apply text-xl font-medium mt-3 mb-2;
}

.ui-editor h5 {
  @apply text-lg font-medium mt-2 mb-1;
}

.ui-editor h6 {
  @apply text-base font-medium mt-2 mb-1 text-gray-500;
}
</style>
