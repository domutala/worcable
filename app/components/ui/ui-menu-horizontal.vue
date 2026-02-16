<script setup lang="ts">
const { minToShow, gap } = defineProps<{
  minToShow?: number;
  gap?: number;
  ui?: { base?: string };
}>();

const ul = useTemplateRef("ul");
let resizeObserver = ref<ResizeObserver>();
const mutationObserver = ref<MutationObserver>();

const nShow = defineModel<number>("nShow", { default: 0 });
const nHide = defineModel<number>("nHide", { default: 0 });
const itemStates = defineModel<Record<string, "show" | "hide">>("states", {
  default: {},
});

onMounted(() => {
  if (!ul.value) return;

  mutationObserver.value = new MutationObserver(() => setChild());
  mutationObserver.value.observe(ul.value, { childList: true });

  // resizeObserver.value = new ResizeObserver(() => setChild());
  // resizeObserver.value.observe(ul.value);

  addEventListener("resize", () => setChild());
  setChild();
});

async function setChild() {
  if (!ul.value) return;

  const _gap = gap ?? 0;

  ul.value.classList.remove("hide-all-item");
  ul.value.classList.add("show-all-items");

  await new Promise((resolve) => setTimeout(resolve, 10));

  itemStates.value = {};
  nShow.value = ul.value.children.length;
  const bounding = ul.value.getBoundingClientRect();
  let iWidth = 0;

  for (let i = 0; i < ul.value.children.length; i++) {
    const child = ul.value.children.item(i) as HTMLElement;

    const index = child.getAttribute("item-index");
    if (index) itemStates.value[index] = "show";

    child.setAttribute("menu-item", "");
    child.removeAttribute("item-hidden");

    const w = i * _gap + child.getBoundingClientRect().width;
    iWidth += w;

    if (iWidth <= bounding.width) continue;

    nShow.value--;
    child.setAttribute("item-hidden", "");
    if (index) itemStates.value[index] = "hide";
  }

  if (typeof minToShow === "number" && nShow.value < minToShow) {
    ul.value.classList.add("hide-all-item");
    nShow.value = 0;
  }

  ul.value.classList.remove("show-all-items");
  nHide.value = ul.value.children.length - nShow.value;
  itemStates.value = itemStates.value;
}

onBeforeUnmount(() => {
  resizeObserver.value?.disconnect();
  mutationObserver.value?.disconnect();
  removeEventListener("resize", () => setChild());
});
</script>

<template>
  <slot name="before" :n-show :n-hide :item-states />
  <ul
    ref="ul"
    :class="ui?.base"
    :style="{ gap: `${gap ?? 0}px` }"
    class="flex-1 flex items-center overflow-hidden"
    data-menu-horizontal
  >
    <slot :n-show :n-hide :item-states />
  </ul>

  <slot name="after" :n-show :n-hide :item-states />
</template>

<style lang="scss">
[data-menu-horizontal] {
  &:not(.show-all-items) {
    [menu-item][item-hidden] {
      display: none !important;
    }
  }

  &.hide-all-item {
    [menu-item] {
      display: none !important;
    }
  }
}
</style>
