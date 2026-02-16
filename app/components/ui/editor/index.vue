<script setup lang="ts">
import type { EditorEmojiMenuItem, EditorToolbarItem } from "@nuxt/ui";
import { Emoji, gitHubEmojis } from "@tiptap/extension-emoji";
import { TextAlign } from "@tiptap/extension-text-align";

const { editable, placeholder } = defineProps({
  editable: { type: Boolean, default: true },
  placeholder: String,
  ui: { type: Object as PropType<{ editor?: string }> },
});

const content = defineModel<string>({});
const extensions = [TextAlign, Emoji] as any;

const appendToBody = false ? () => document.body : undefined;
const emojiItems: EditorEmojiMenuItem[] = gitHubEmojis.filter(
  (emoji) => !emoji.name.startsWith("regional_indicator_"),
);

const toolbarItems: EditorToolbarItem[][] = [
  // History controls
  [
    {
      kind: "undo",
      icon: "i-lucide-undo",
      tooltip: { text: "Undo" },
    },
    {
      kind: "redo",
      icon: "i-lucide-redo",
      tooltip: { text: "Redo" },
    },
  ],
  // Block types
  [
    {
      icon: "i-lucide-heading",
      tooltip: { text: "Headings" },
      content: {
        align: "start",
      },
      items: [
        {
          kind: "heading",
          level: 1,
          icon: "i-lucide-heading-1",
          label: "Heading 1",
        },
        {
          kind: "heading",
          level: 2,
          icon: "i-lucide-heading-2",
          label: "Heading 2",
        },
        {
          kind: "heading",
          level: 3,
          icon: "i-lucide-heading-3",
          label: "Heading 3",
        },
        {
          kind: "heading",
          level: 4,
          icon: "i-lucide-heading-4",
          label: "Heading 4",
        },
      ],
    },
    {
      icon: "i-lucide-list",
      tooltip: { text: "Lists" },
      content: {
        align: "start",
      },
      items: [
        {
          kind: "bulletList",
          icon: "i-lucide-list",
          label: "Bullet List",
        },
        {
          kind: "orderedList",
          icon: "i-lucide-list-ordered",
          label: "Ordered List",
        },
      ],
    },
    {
      kind: "blockquote",
      icon: "i-lucide-text-quote",
      tooltip: { text: "Blockquote" },
    },
    {
      kind: "codeBlock",
      icon: "i-lucide-square-code",
      tooltip: { text: "Code Block" },
    },
    {
      kind: "horizontalRule",
      icon: "i-lucide-separator-horizontal",
      tooltip: { text: "Horizontal Rule" },
    },
  ],
  // Text formatting
  [
    {
      kind: "mark",
      mark: "bold",
      icon: "i-lucide-bold",
      tooltip: { text: "Bold" },
    },
    {
      kind: "mark",
      mark: "italic",
      icon: "i-lucide-italic",
      tooltip: { text: "Italic" },
    },
    {
      kind: "mark",
      mark: "underline",
      icon: "i-lucide-underline",
      tooltip: { text: "Underline" },
    },
    {
      kind: "mark",
      mark: "strike",
      icon: "i-lucide-strikethrough",
      tooltip: { text: "Strikethrough" },
    },
    {
      kind: "mark",
      mark: "code",
      icon: "i-lucide-code",
      tooltip: { text: "Code" },
    },
  ],
  // Link
  [
    {
      kind: "link",
      icon: "i-lucide-link",
      tooltip: { text: "Link" },
    },
  ],
  // Text alignment
  [
    {
      icon: "i-lucide-align-justify",
      tooltip: { text: "Text Align" },
      content: { align: "end" },
      items: [
        {
          kind: "textAlign",
          align: "left",
          icon: "i-lucide-align-left",
          label: "Align Left",
        },
        {
          kind: "textAlign",
          align: "center",
          icon: "i-lucide-align-center",
          label: "Align Center",
        },
        {
          kind: "textAlign",
          align: "right",
          icon: "i-lucide-align-right",
          label: "Align Right",
        },
        {
          kind: "textAlign",
          align: "justify",
          icon: "i-lucide-align-justify",
          label: "Align Justify",
        },
      ],
    },
  ],
];

const toolbarBubbledItems: EditorToolbarItem[][] = [
  [
    {
      icon: "i-lucide-heading",
      tooltip: { text: "Headings" },
      content: {
        align: "start",
      },
      items: [
        {
          kind: "heading",
          level: 1,
          icon: "i-lucide-heading-1",
          label: "Heading 1",
        },
        {
          kind: "heading",
          level: 2,
          icon: "i-lucide-heading-2",
          label: "Heading 2",
        },
        {
          kind: "heading",
          level: 3,
          icon: "i-lucide-heading-3",
          label: "Heading 3",
        },
        {
          kind: "heading",
          level: 4,
          icon: "i-lucide-heading-4",
          label: "Heading 4",
        },
      ],
    },
  ],
  [
    {
      kind: "mark",
      mark: "bold",
      icon: "i-lucide-bold",
      tooltip: { text: "Bold" },
    },
    {
      kind: "mark",
      mark: "italic",
      icon: "i-lucide-italic",
      tooltip: { text: "Italic" },
    },
    {
      kind: "mark",
      mark: "underline",
      icon: "i-lucide-underline",
      tooltip: { text: "Underline" },
    },
    {
      kind: "mark",
      mark: "strike",
      icon: "i-lucide-strikethrough",
      tooltip: { text: "Strikethrough" },
    },
    {
      kind: "mark",
      mark: "code",
      icon: "i-lucide-code",
      tooltip: { text: "Code" },
    },
  ],
];
</script>

<template>
  <div class="overflow-hidden rounded-2xl">
    <UEditor
      v-slot="{ editor }"
      v-model="content"
      class="ui-editor overflow-auto bg-inherit text-base"
      content-type="markdown"
      :ui="{ content: 'min--30' }"
      :class="ui?.editor"
      :extensions
      :placeholder
      :editable
    >
      <template v-if="editor.isEditable">
        <!-- <UEditorDragHandle :editor="editor" /> -->

        <UEditorToolbar
          :editor
          :items="toolbarItems"
          class="px-5 py-0 overflow-x-auto bg-inherit sticky top-0 border-b border-default z-10"
        />

        <!-- <UEditorToolbar
        :editor
        :items="toolbarBubbledItems"
        :append-to="appendToBody"
        class="sm:px-8 overflow-x-auto"
        layout="bubble"
      /> -->

        <!-- <UEditorEmojiMenu :editor="editor" :items="emojiItems" :append-to="appendToBody" /> -->
      </template>
    </UEditor>
  </div>
</template>

<style lang="scss">
.ui-editor {
  [role="toolbar"] {
    &::-webkit-scrollbar {
      height: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--ui-border);
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--ui-border);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-left: 1px solid var(--ui-border);
  }

  .tiptap {
    padding: 0 !important;

    &[contenteditable="true"] {
      padding: 25px !important;
    }
  }
}
</style>
