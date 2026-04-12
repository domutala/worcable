<script setup lang="ts">
import { watchDebounced, useWindowSize } from "@vueuse/core";

type States = Record<string, "show" | "hide">;

const { minToShow, gap } = defineProps<{
  minToShow?: number;
  gap?: number;
  ui?: { base?: string };
}>();

const { width } = useWindowSize();
const ul = useTemplateRef("ul");
const mutationObserver = ref<MutationObserver>();

const itemsShow = defineModel<number>("itemsShow", { default: 0 });
const itemsHide = defineModel<number>("itemsHide", { default: 0 });
const states = defineModel<States>("states", { default: {} });

onMounted(() => {
  if (!ul.value) return;

  mutationObserver.value = new MutationObserver(() => setChild());
  mutationObserver.value.observe(ul.value, { childList: true });
});

watchDebounced(() => width.value, setChild, {
  debounce: 500,
  immediate: true,
});

function falseOrTrue(attr?: string | null) {
  if (attr === "false") return false;
  if (typeof attr === "string") return true;
  return false;
}
async function setChild() {
  await new Promise((resolve) => setTimeout(resolve, 10));
  if (!ul.value) return;

  const _gap = gap ?? 0;

  ul.value.classList.remove("hide-all-item");
  ul.value.classList.add("show-all-items");

  await new Promise((resolve) => setTimeout(resolve, 0));

  const _states: States = {};
  let nShow = 0;
  let nHide = 0;
  let iWidth = 0;
  const bounding = ul.value.getBoundingClientRect();

  for (let i = 0; i < ul.value.children.length; i++) {
    const child = ul.value.children.item(i) as HTMLElement;
    const index = child.getAttribute("item-index") || i.toString();

    child.setAttribute("menu-item", "");
    child.removeAttribute("item-hidden");

    const alwaysHide = falseOrTrue(child.getAttribute("always-hide"));
    const notHide = falseOrTrue(child.getAttribute("not-hide"));
    const w = i * _gap + child.getBoundingClientRect().width;
    iWidth += w;

    let toShow = iWidth < bounding.width;
    if (alwaysHide) toShow = false;
    if (notHide) toShow = true;

    if (toShow) {
      nShow++;
      _states[index] = "show";
    } else {
      nHide++;
      child.setAttribute("item-hidden", "");
      _states[index] = "hide";
    }
  }

  if (typeof minToShow === "number" && nShow < minToShow) {
    ul.value.classList.add("hide-all-item");
    nShow = 0;
    nHide = ul.value.children.length;
  }

  ul.value.classList.remove("show-all-items");

  itemsShow.value = nShow;
  itemsHide.value = nHide;
  states.value = _states;
}

onBeforeUnmount(() => {
  mutationObserver.value?.disconnect();
});
</script>

<template>
  <slot name="before" :items-show :items-hide :states />
  <ul
    ref="ul"
    :class="ui?.base"
    :style="{ gap: `${gap ?? 0}px` }"
    class="flex-1 flex items-center overflow-hidden"
    data-menu-horizontal
  >
    <slot :items-show :items-hide :states />
  </ul>

  <slot name="after" :items-show :items-hide :states />
</template>

<style lang="scss">
[data-menu-horizontal] {
  &:not(.show-all-items) {
    [menu-item][item-hidden] {
      &:not([not-hide]) {
        display: none !important;
      }
    }
  }

  &.hide-all-item {
    [menu-item] {
      &:not([not-hide]) {
        display: none !important;
      }
    }
  }
}
</style>
