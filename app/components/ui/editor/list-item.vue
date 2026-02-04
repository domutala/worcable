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
  <u-button
    icon="i-lucide-list"
    variant="ghost"
    class="cursor-pointer"
    :color="editor.isActive('bulletList') ? 'primary' : 'neutral'"
    @click="editor.chain().focus().toggleBulletList().run()"
  ></u-button>
  <u-button
    variant="ghost"
    icon="i-lucide-list-ordered"
    class="cursor-pointer"
    :color="editor.isActive('orderedList') ? 'primary' : 'neutral'"
    @click="editor.chain().focus().toggleOrderedList().run()"
  >
  </u-button>

  <!-- <u-button
    color="neutral"
    variant="outline"
    :disabled="!editor.can().splitListItem('listItem')"
    @click="editor.chain().focus().splitListItem('listItem').run()"
  >
    Split list item
  </u-button>
  <u-button
    color="neutral"
    variant="outline"
    :disabled="!editor.can().sinkListItem('listItem')"
    @click="editor.chain().focus().sinkListItem('listItem').run()"
  >
    Sink list item
  </u-button>
  <u-button
    color="neutral"
    variant="outline"
    :disabled="!editor.can().liftListItem('listItem')"
    @click="editor.chain().focus().liftListItem('listItem').run()"
  >
    Lift list item
  </u-button> -->
</template>

<style>
@reference "tailwindcss";

.ui-editor ul {
  @apply list-disc;
}

.ui-editor ol {
  @apply list-decimal;
}

.ui-editor ul,
.ui-editor ol {
  padding: 0 1rem;
  margin: 1.25rem 1rem 1.25rem 0.4rem;
}

.ui-editor li p {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}
</style>
