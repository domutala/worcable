// store.ts
import type { DropdownMenuItem } from "@nuxt/ui";
import { type ShallowRef } from "vue";
import type { Apply, Job } from "~~/server/database/schema";

export function useJob(job: ShallowRef<Job>) {
  const statusSubmiting = ref(false);
  async function statusSubmit(status: string | null) {
    statusSubmiting.value = true;

    try {
      job.value = await $fetch<Job>(`/api/admin/job`, {
        method: "post",
        body: { ...job.value, status },
      });

      setTimeout(() => {
        dispatchEvent(
          new CustomEvent(`${job.value.id}:update`, { detail: job.value }),
        );
      }, 0);
    } catch (error) {
      console.log(error);
    } finally {
      statusSubmiting.value = false;
    }
  }

  const statusDropdownItems = computed(() => {
    ["open", "close", "pause"];
    const items: DropdownMenuItem[] = ["open", "close", "pause"].map(
      (status) => {
        return {
          label: Use.i18n.t(`job.items.status.items.${status}.label`),
          value: status,
          // icon: status.icon || applyStatusIcons[status.key],
          class: "cursor-pointer",
        };
      },
    );

    return items
      .filter((status) => status.value !== job.value.status)
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
      label: Use.i18n.t(`job.items.status.items.${job.value.status}.label`),
      // icon: ApplyUtils.getStatusIcon(job.value, apply.value.status),
      children: statusDropdownItems.value,
      class: "cursor-pointer",
    } as DropdownMenuItem;
  });

  return { statusDropdownItems, statusDropdown, statusSubmiting, statusSubmit };
}
