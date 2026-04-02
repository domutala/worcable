<script setup lang="ts">
import { tv } from "@nuxt/ui/utils/tv";
import { input } from "./theme";
import _ from "lodash";

const props = defineProps<{
  hideSeparator?: boolean;
  readonly?: boolean;
  autofocus?: boolean;
  ui?: Partial<typeof input>;
}>();

const ui = computed(() => {
  const ui = _.cloneDeep<typeof input>(input);
  _.unset(ui, "input");

  return tv({ extend: tv({ slots: ui }) })();
});

const uiProp = computed(() => {
  const ui = _.cloneDeep<typeof input>((props.ui as any) ?? {});
  return ui;
});

const open = defineModel<boolean>("open");
const searchTerm = defineModel<string>("search-term", {});
</script>

<template>
  <div
    :class="[
      { '[&>.separator]:block': open },
      ui.base({ class: uiProp?.base }),
    ]"
  >
    <div class="min-h-12.5 relative flex group">
      <div>
        <div class="w-13 flex justify-center items-center h-12.5">
          <u-icon name="i-lucide-search" class="opacity-50 size-6" />
        </div>
      </div>
      <u-textarea
        v-model="searchTerm"
        type="search"
        class="outline-0 text-[16px] w-full"
        autocomplete="off"
        autocapitalize="off"
        aria-autocomplete="both"
        aria-expanded="true"
        :autoresize="true"
        :rows="1"
        :ui="{ base: 'bg-transparent ring-0! py-2' }"
        :readonly
        :autofocus
        @focus="open = true"
        @click="open = true"
      >
      </u-textarea>

      <div
        v-if="searchTerm && !readonly"
        class="justify-center items-center h-12.5 group-focus-within:flex hidden"
      >
        <u-tooltip :text="'Effacer'" :content="{ sideOffset: 0 }">
          <u-button
            size="md"
            variant="ghost"
            icon="i-lucide-x"
            color="neutral"
            class="cursor-pointer"
            square
            @click="searchTerm = ''"
          />
        </u-tooltip>
      </div>

      <slot name="after" />

      <div class="pr-3"></div>
    </div>

    <div
      v-if="!hideSeparator"
      class="separator"
      :class="ui.separator({ class: uiProp?.separator })"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
textarea {
  &::-webkit-scrollbar {
    width: 0px;
    transition: all 0.5s ease;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--ui-border);
  }
}
</style>
