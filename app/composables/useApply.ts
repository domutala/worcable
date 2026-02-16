// store.ts
import type { DropdownMenuItem } from "@nuxt/ui";
import { shallowRef, type ShallowRef } from "vue";
import { applyStatusIcons, ApplyUtils } from "~/tools/apply";
import type { Apply, Job } from "~~/server/database/schema";

export function useApply(job: ShallowRef<Job>, apply: ShallowRef<Apply>) {
  const statusSubmiting = ref(false);
  async function statusSubmit(status: string | null) {
    statusSubmiting.value = true;

    try {
      apply.value = await $fetch<Apply>(
        `/api/admin/apply/${apply.value.id}/status`,
        {
          method: "patch",
          body: { id: job.value.id, to: status },
        },
      );

      setTimeout(() => {
        dispatchEvent(
          new CustomEvent(`${apply.value.id}:update`, { detail: apply.value }),
        );
      }, 0);
    } catch (error) {
      console.log(error);
    } finally {
      statusSubmiting.value = false;
    }
  }

  const statusDropdownItems = computed(() => {
    const items: DropdownMenuItem[] = job.value.applyStatus.map((status) => {
      return {
        label: status.label || Use.i18n.t(`apply.status.${status.key}.label`),
        value: status.key,
        icon: status.icon || applyStatusIcons[status.key],
        class: "cursor-pointer",
      };
    });

    items.unshift({
      label: Use.i18n.t(`apply.status.labels.null`),
      value: null,
      class: "cursor-pointer",
      icon: applyStatusIcons.null,
    });

    return items
      .filter((status) => status.value !== apply.value.status)
      .map((item) => {
        const i: DropdownMenuItem = {
          ...item,
          onSelect: (e) => {
            e.preventDefault();
            statusSubmit(item.value);
          },
        };

        return i;
      });
  });

  const statusDropdown = computed(() => {
    return {
      loading: statusSubmiting.value,
      label: ApplyUtils.getStatusLabel(job.value, apply.value.status),
      icon: ApplyUtils.getStatusIcon(job.value, apply.value.status),

      children: statusDropdownItems.value,
    };
  });

  return { statusDropdownItems, statusDropdown, statusSubmiting, statusSubmit };
}
