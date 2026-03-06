// store.ts
import type { DropdownMenuItem } from "@nuxt/ui";
import { type ShallowRef } from "vue";
import type { Apply, Job } from "~~/server/database/collections";

export function useJob(job: ShallowRef<Job>) {
  const statusSubmiting = ref(false);
  async function statusSubmit(status: string | null) {
    statusSubmiting.value = true;

    try {
      job.value = await Api.$fetch(`/api/admin/job`, {
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
      disabled: Store.session.user?.role !== "admin",
    } as DropdownMenuItem;
  });

  const menuItems = computed(() => {
    if (!Store.session.user) return [];

    const statusItems = statusDropdown.value;
    statusItems.variant = "soft";
    statusItems.color = "neutral";
    // statusItems.notHide = true;

    const items: DropdownMenuItem[] = [statusItems];

    if (["admin", "recruiter"].includes(Store.session.user.role)) {
      items.push(
        {
          label: Use.i18n.t("job.actions.add_new_apply"),
          icon: "i-lucide-user-round-plus",
        },
        {
          label: Use.i18n.t("job.actions.broadcast"),
          icon: "i-lucide-corner-up-right",
          onSelect(e) {
            alert("dsdfsf");
          },
        },
      );
    }

    items.push(
      {
        label: Use.i18n.t("job.actions.display"),
        icon: "i-lucide-file-text",
        target: "_blank",
        to: Use.localePath({ name: "job-id", params: { id: job.value.id } }),
      },
      {
        label: Use.i18n.t("job.actions.share_job"),
        icon: "i-lucide-send",
      },
    );

    if (Store.session.user.role === "admin") {
      items.push({
        label: Use.i18n.t("job.actions.update"),
        icon: "i-lucide-pencil-line",
        to: Use.localePath({
          name: "admin-job-id-update",
          params: { id: job.value.id },
        }),
      });
    }

    return items;
  });

  return {
    statusDropdownItems,
    statusDropdown,
    statusSubmiting,
    statusSubmit,
    menuItems,
  };
}
