<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Editor } from "@tiptap/vue-3";

const { editor } = defineProps<{ editor: Editor }>();

type Align = "left" | "right" | "center" | "justify";
const alignments: Align[] = ["left", "right", "center", "justify"];
const icons = {
  right: "i-lucide-text-align-end",
  center: "i-lucide-text-align-center",
  left: "i-lucide-text-align-start",
  justify: "i-lucide-text-align-justify",
};

const active = computed(() => {
  let is;

  for (const key of alignments) {
    if (editor.isActive({ textAlign: key })) {
      is = key;
      break;
    }
  }

  return is;
});

const items = computed(() => {
  // onSelect(e) {
  //       editor.chain().focus().setTextAlign(key).run();
  //     },
  const items: DropdownMenuItem[] = alignments.map((key) => {
    return {
      icon: icons[key],
    };
  });

  return items;
});

const icon = computed(() => {
  if (active.value) return icons[active.value];
  return "i-lucide-text";
});

function setAlign(align: Align) {
  editor.chain().focus().setTextAlign(align).run();
}
</script>

<template>
  <UPopover>
    <UButton
      :icon="icon"
      :color="active ? 'primary' : 'neutral'"
      variant="ghost"
      class="cursor-pointer"
    />

    <template #content>
      <UButton
        v-for="(align, i) in alignments"
        :key="i"
        :icon="icons[align]"
        :color="active === align ? 'primary' : 'neutral'"
        variant="ghost"
        @click="setAlign(align)"
      />
    </template>
  </UPopover>
</template>
