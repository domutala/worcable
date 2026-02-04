<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { Markdown } from "@tiptap/markdown";

import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Placeholder from "@tiptap/extension-placeholder";
import HardBreak from "@tiptap/extension-hard-break";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

const { editable, placeholder } = defineProps({
  editable: { type: Boolean, default: true },
  placeholder: String,
});

const content = defineModel<string>({ default: "" });

const lowlight = createLowlight(all);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const editor = useEditor({
  content: content.value,

  // register extensions
  extensions: [
    StarterKit,
    // @ts-ignore
    Markdown,

    Document,
    Paragraph,
    Text,
    HardBreak,

    Heading.configure({}),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Underline,
    BulletList,
    OrderedList,
    ListItem,
    Blockquote,

    // @ts-ignore
    HorizontalRule,

    Placeholder.configure({
      placeholder, // texte du placeholder
      showOnlyWhenEditable: true,
    }),

    CodeBlockLowlight.configure({
      lowlight,
    }),
  ],

  // Don't render on the server, only on the client after hydration
  // immediatelyRender: false,

  // place the cursor in the editor after initialization
  autofocus: true,
  // make the text editable (default is true)
  editable,
  // prevent loading the default ProseMirror CSS that comes with Tiptap
  // should be kept as `true` for most cases as it includes styles
  // important for Tiptap to work correctly
  injectCSS: false,

  contentType: "markdown",

  onUpdate: () => {
    content.value = editor.value!.getHTML();
  },
});

watch(() => content.value, onContent);

function onContent() {
  if (!editor.value) return;

  const isSame = editor.value.getHTML() === content.value;

  // JSON
  // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

  if (isSame) return;

  editor.value.commands.setContent(content.value);
}

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div class="ui-editor bg-inherit">
    <div
      v-if="editor && editable"
      class="flex items-center gap-2 p-2 border-b border-default sticky top-0 z-50 bg-inherit"
    >
      <u-button
        icon="i-lucide-undo"
        color="neutral"
        variant="ghost"
        :disabled="!editor?.can().chain().focus().undo().run()"
        @click="editor?.chain().focus().undo().run()"
      >
      </u-button>

      <!-- Redo (Next) -->
      <u-button
        icon="i-lucide-redo"
        color="neutral"
        variant="ghost"
        :disabled="!editor?.can().chain().focus().redo().run()"
        @click="editor?.chain().focus().redo().run()"
      >
      </u-button>

      <ui-editor-heading :editor />
      <ui-editor-text-align :editor />
      <ui-editor-list-item :editor />
      <ui-editor-text-formating :editor />

      <u-button
        variant="ghost"
        icon="i-lucide-code"
        :color="editor.isActive('codeBlock') ? 'primary' : 'neutral'"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
      </u-button>
    </div>

    <EditorContent :editor="editor" v-model="content" />
  </div>
</template>

<style lang="scss">
.ui-editor {
  .tiptap {
    outline: none;
    width: 100%;

    :first-child {
      margin-top: 0;
    }

    &[contenteditable="true"] {
      padding: 25px;
    }

    p.is-editor-empty:first-child::before {
      color: var(--text-color-muted);
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }
  }
}
</style>
