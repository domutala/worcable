<script lang="ts" setup>
const content = ref(
  `

  # Hello World\n\nThis is **Markdown**!

  <h1>These 😃 are 🔥 some 😺 emojis</h1>
  🤯 rendered 👻 as 💆 inline ✌ nodes.

  <blockquote>
    Nothing is impossible, the word itself says “I’m possible!”
  </blockquote>
  <p>Audrey Hepburn</p>

Type : to open the autocomplete.

Even :octocat: custom :trollface: emojis :neckbeard: are :rage1: supported.

And unsupported emojis (without a fallback image) are rendered as just the shortcode :this_does_not_exist:.

In code blocks all emojis are rendered as plain text. 👩‍💻👨‍💻

There is also support for emoticons. Try typing <3.

<ul>
  <li>This is a bullet list.</li>
  <li>And it has three list items.</li>
  <li>Here is the third one.</li>
</ul>
`,
);
</script>

<template>
  <u-container class="py-15">
    <UColorModeButton />
    <ui-editor v-model="content" class="border rounded-2xl border-default" />
  </u-container>
</template>
