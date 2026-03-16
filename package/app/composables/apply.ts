import type { DropdownMenuItem } from "@nuxt/ui";
import type { ShallowRef } from "vue";
import * as z from "zod";
import _ from "lodash";
import type { Apply } from "~~/server/database/collections";

export const applyStatusColors: Record<string, string> = {
  REJECTED: "#ff0000",
  INIT: "#0050da",
  TO_CONTACT: "#a41aff",
  INTERVIEW: "#F59E0B",
  HIRED: "#18ca00",
};

export const applyStatusIcons: Record<string, string> = {
  INIT: "i-lucide-newspaper",
  // INIT: "i-lucide-square-chart-gantt",
  REJECTED: "i-lucide-badge-x",
  TO_CONTACT: "i-lucide-phone-outgoing",
  INTERVIEW2: "i-lucide-calendar-range",
  INTERVIEW: "i-lucide-video",
  HIRED: "i-lucide-check-check",
  null: "i-lucide-square-dashed-mouse-pointer",
};

type ApplyStatusInstance = {
  canUpdate: ComputedRef<boolean>;
  loading: boolean;
  menuItems: ComputedRef<DropdownMenuItem[]>;
  dropdownMenuItems: ComputedRef<DropdownMenuItem>;

  color: ComputedRef<string | undefined>;
  label: ComputedRef<string>;
  icon: ComputedRef<string | undefined>;
  bgColor: ComputedRef<string>;

  submit(status: string | null): Promise<void>;
};
type ApplyNoteInstance = {
  loading: boolean;
  canUpdate: ComputedRef<boolean>;
  submit(note: number): Promise<void>;
};

export type ApplyInstance = {
  ready: ShallowRef<boolean>;
  loading: ShallowRef<boolean>;
  apply: ShallowRef<Apply>;
  job: ShallowRef<JobInstance>;
  status: ShallowRef<ApplyStatusInstance>;
  note: ShallowRef<ApplyNoteInstance>;

  dispatch(): void;
  refresh(id?: string): void;
};

const applyInstances = new Map<string, ApplyInstance>();

export const useApply = (
  id: string,
  { onReady }: { onReady?: () => void } = {},
) => {
  let _id = id;

  if (!applyInstances.has(id)) {
    const ready = shallowRef(false);
    const loading = shallowRef(false);
    const job = shallowRef<JobInstance>(null as any);
    const apply = shallowRef<Apply>(null as any);
    const status = shallowRef<ApplyStatusInstance>(null as any);
    const note = shallowRef<ApplyNoteInstance>(null as any);

    function dispatch() {
      setTimeout(() => {
        dispatchEvent(
          new CustomEvent(`${apply.value.id}:update`, {
            detail: { apply: apply.value, action: "apply:update" },
          }),
        );
      }, 0);
    }

    function getStatusLabel(key?: string | null) {
      const applyStatus = job.value.applyStatus.value.values.value.find(
        (s) => s.key === key,
      );

      if (!applyStatus) return Use.i18n.t("apply.status.NULL_STATUS.label");
      if (applyStatus?.label) return applyStatus.label;

      let label = Use.i18n.t(`apply.status.${status}.label`);
      if (label === `apply.status.${status}.label`) {
        label = Use.i18n.t(`job.items.applyStatus.labels.without_name`);
      }

      return label;
    }

    function getStatusIcon(key?: string | null) {
      const applyStatus = job.value.applyStatus.value.values.value.find(
        (s) => s.key === key,
      );

      if (!applyStatus) return applyStatusIcons.null;
      return applyStatus?.icon ?? applyStatusIcons[applyStatus.key];
    }

    async function init() {
      if (_id === "_MODAL_") return;

      loading.value = true;
      ready.value = false;

      try {
        apply.value = await Api.$fetch<Apply>(`/api/admin/apply/${_id}`);
        job.value = useJob(apply.value.jobID.toString());

        status.value = {
          loading: false,

          // ---
          color: computed(() => {
            return !apply.value.status
              ? "var(--color-surface)"
              : (job.value.applyStatus.value.values.value.find(
                  (s) => s.key === apply.value.status,
                )?.color ?? applyStatusColors[apply.value.status]);
          }),

          bgColor: computed(() => {
            return !apply.value.status
              ? "var(--color-surface)"
              : `color-mix(in srgb, ${status.value.color.value} 10%, #000 0%)`;
          }),

          label: computed(() => {
            const applyStatus = job.value.applyStatus.value.values.value.find(
              (s) => s.key === apply.value.status,
            );

            if (!applyStatus)
              return Use.i18n.t("apply.status.NULL_STATUS.label");
            if (applyStatus?.label) return applyStatus.label;

            let label = Use.i18n.t(`apply.status.${apply.value.status}.label`);
            if (label === `apply.status.${apply.value.status}.label`) {
              label = Use.i18n.t(`job.items.applyStatus.labels.without_name`);
            }

            return label;
          }),

          icon: computed(() => {
            const applyStatus = job.value.applyStatus.value.values.value.find(
              (s) => s.key === apply.value.status,
            );

            if (!applyStatus) return applyStatusIcons.null;
            return applyStatus?.icon ?? applyStatusIcons[applyStatus.key];
          }),
          // ---

          canUpdate: computed(() => {
            return ["admin", "recruiter"].includes(
              job.value.jobUser.value.role,
            );
          }),

          menuItems: computed(() => {
            const items: DropdownMenuItem[] =
              job.value.applyStatus.value.values.value.map((status) => {
                return {
                  label:
                    status.label ||
                    Use.i18n.t(`apply.status.${status.key}.label`),
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
                    status.value.submit(item.value);
                  },
                };

                return i;
              });
          }),

          dropdownMenuItems: computed(() => {
            const item: DropdownMenuItem = {
              loading: status.value.loading,
              label: status.value.label.value, // getStatusLabel(apply.value.status),
              icon: status.value.icon.value, //getStatusIcon(apply.value.status),
              children: status.value.menuItems.value,
            };

            return item;
          }),

          async submit(value) {
            status.value.loading = true;

            try {
              apply.value = await $fetch<Apply>(
                `/api/admin/apply/${apply.value.id}/status`,
                { method: "post", body: { to: value } },
              );

              dispatch();
            } catch (error) {
              console.log(error);
            } finally {
              status.value.loading = false;
            }
          },
        };

        note.value = {
          loading: false,

          canUpdate: computed(() => {
            return ["admin", "recruiter"].includes(
              job.value.jobUser.value.role,
            );
          }),

          async submit(value) {
            note.value.loading = true;

            try {
              apply.value = await $fetch<Apply>(
                `/api/admin/apply/${apply.value.id}/note`,
                { method: "post", body: { note: value } },
              );

              dispatch();
            } catch (error) {
              console.log(error);
            } finally {
              note.value.loading = false;
            }
          },
        };
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
        ready.value = true;

        onReady?.();
      }
    }

    init();

    applyInstances.set(id, {
      ready,
      loading,
      job,
      apply,
      status,
      note,
      dispatch,

      refresh(id) {
        _id = id ?? _id;
        init();
      },
    });
  }

  return applyInstances.get(id) as ApplyInstance;
};

export const useApplys = () => {
  return applyInstances;
};
