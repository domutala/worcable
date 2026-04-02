<script setup lang="ts">
import { tv } from "@nuxt/ui/utils/tv";
import { content, input } from "./theme";
import { onClickOutside } from "@vueuse/core";
import _ from "lodash";

const props = defineProps<{
  hideSeparator?: boolean;
  readonly?: boolean;
  autofocus?: boolean;
  notClickOutside?: boolean;
  ui?: Partial<typeof content & { input: Partial<typeof input> }>;
}>();

const ui = computed(() => {
  const ui = _.cloneDeep<Omit<typeof content, "input">>(content);
  _.unset(ui, "input");

  return tv({ extend: tv({ slots: ui }) })();
});

const uiProp = computed(() => {
  const ui = _.cloneDeep<Omit<typeof content, "input">>(
    (props?.ui as any) || {}
  );
  _.unset(ui, "input");

  return ui;
});

const el = useTemplateRef("el");
onClickOutside(
  el,
  () => {
    if (props.notClickOutside) return;
    open.value = false;
  },
  {}
);

const open = defineModel<boolean>("open");
const searchTerm = defineModel<string>("search-term", {});
</script>

<template>
  <div
    ref="el"
    class="max-h-full overflow-hidden flex flex-1 flex-col"
    :class="{
      'sm:rounded-3xl': searchTerm,
      'rounded-3xl': open,
      'rounded-full': !open,
    }"
  >
    <div
      class="content rounded-[inherit] overflow-auto flex flex-col"
      :class="[
        { '[&>.dropdown]:block': open },
        ui.content({ class: uiProp?.content }),
      ]"
    >
      <ui-autocomplete-input
        v-model:open="open"
        v-model:search-term="searchTerm"
        v-bind="props"
        :ui="props.ui?.input"
        class="sticky top-0 z-50"
      >
        <template #after>
          <slot name="input-after" />
        </template>
      </ui-autocomplete-input>

      <div class="dropdown hidden">
        <div class="p-5">
          dolor sit, amet consectetur adipisicing elit. Enim maiores totam quos
          voluptatum laudantium ex, vel accusantium minus iusto voluptas, eum
          ipsam, veniam nobis! Vel perferendis recusandae cupiditate deserunt
          laboriosam! Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Enim maiores totam quos voluptatum laudantium ex, vel accusantium
          minus iusto voluptas, eum ipsam, veniam nobis! Vel perferendis
          recusandae cupiditate deserunt laboriosam! Lorem ipsum dolor sit, amet
          consectetur adipisicing elit. Enim maiores totam quos voluptatum
          laudantium ex, vel accusantium minus iusto voluptas, eum ipsam, veniam
          nobis! Vel perferendis recusandae cupiditate deserunt laboriosam!
        </div>

        <slot name="content-bottom" />
      </div>
    </div>

    <slot name="bottom" />
  </div>
</template>

<style lang="scss" scoped>
textarea,
.content {
  &::-webkit-scrollbar {
    width: 0px;
    transition: all 0.5s ease;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--ui-border);
  }
}
</style>
