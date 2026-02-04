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
  <!-- blockquote -->
  <u-button
    variant="ghost"
    icon="i-lucide-text-quote"
    class="cursor-pointer"
    :color="editor.isActive('blockquote') ? 'primary' : 'neutral'"
    @click="editor.chain().focus().toggleBlockquote().run()"
  >
  </u-button>

  <!-- bold -->
  <u-button
    variant="ghost"
    icon="i-lucide-bold"
    class="cursor-pointer"
    :color="editor.isActive('bold') ? 'primary' : 'neutral'"
    @click="editor.chain().focus().toggleBold().run()"
  >
  </u-button>

  <!-- Italic -->
  <u-button
    variant="ghost"
    icon="i-lucide-italic"
    class="cursor-pointer"
    :color="editor.isActive('italic') ? 'primary' : 'neutral'"
    @click="editor.chain().focus().toggleItalic().run()"
  >
  </u-button>

  <!-- Underline -->
  <u-button
    variant="ghost"
    icon="i-lucide-underline"
    class="cursor-pointer"
    :color="editor.isActive('underline') ? 'primary' : 'neutral'"
    @click="editor.chain().focus().toggleUnderline().run()"
  >
  </u-button>

  <!-- Strike -->
  <u-button
    variant="ghost"
    icon="i-lucide-strikethrough"
    class="cursor-pointer"
    :color="editor.isActive('strike') ? 'primary' : 'neutral'"
    @click="editor.chain().focus().toggleStrike().run()"
  >
  </u-button>

  <u-button
    variant="ghost"
    icon="i-lucide-square-split-vertical"
    class="cursor-pointer"
    color="neutral"
    @click="editor.chain().focus().setHorizontalRule().run()"
  >
  </u-button>
</template>

<style>
@reference "tailwindcss";

.ui-editor blockquote {
  @apply border-l-4 pl-4 my-4;
  border-color: var(--ui-border);
}

.ui-editor hr {
  @apply my-6 border-t;
  border-color: var(--ui-border);
}
</style>
