import type { DropdownMenuItem } from "@nuxt/ui";
import type { ShallowRef } from "vue";
import type { Job, JobUser } from "~~/server/database/collections";
import { getJobShema } from "~~/server/services/job_schema";
import * as z from "zod";
import _ from "lodash";

const { singleApplyStatus, applyStatus } = getJobShema((v) => v);

type JobInstanceStatus = {
  loading: boolean;
  menuItems: ComputedRef<DropdownMenuItem[]>;

  submit(value: string | null): Promise<void>;
  dropdown: ComputedRef<DropdownMenuItem>;
};

type JobApplyStatusInstance = {
  values: ComputedRef<z.output<typeof applyStatus>>;
  filterBy: ShallowRef<string | null>;
  filterItems: globalThis.ComputedRef<DropdownMenuItem>;
  update(value: z.output<typeof singleApplyStatus>): Promise<void>;
  remove(key: string): Promise<void>;
};

export type JobInstance = {
  ready: ShallowRef<boolean>;
  job: ShallowRef<Job>;
  jobUser: ShallowRef<JobUser>;
  loading: ShallowRef<boolean>;
  status: ShallowRef<JobInstanceStatus>;
  menu: ShallowRef<{ items: ComputedRef<DropdownMenuItem[]> }>;
  applyStatus: ShallowRef<JobApplyStatusInstance>;
};

const instances = new Map<string, JobInstance>();

export const useJob = (
  id: string,
  { onReady }: { onReady?: () => void } = {},
) => {
  if (!instances.has(id)) {
    const ready = shallowRef(false);
    const loading = shallowRef(false);
    const job = shallowRef<Job>(null as any);
    const jobUser = shallowRef<JobUser>(null as any);
    const status = shallowRef<JobInstanceStatus>(null as any);
    const applyStatus = shallowRef<JobApplyStatusInstance>(null as any);
    const menu = shallowRef<{ items: ComputedRef<DropdownMenuItem[]> }>(
      {} as any,
    );

    async function init() {
      loading.value = true;

      try {
        job.value = await Api.$fetch<Job>(`/api/job/${id}`);
        jobUser.value = await Api.$fetch<JobUser>(
          `/api/admin/job/${id}/user-job`,
        );

        status.value = {
          loading: false,

          async submit(value: string | null) {
            status.value.loading = true;

            try {
              job.value = await Api.$fetch<Job>(
                `/api/admin/job/${job.value.id}/status`,
                { method: "post", body: { status: value } },
              );

              setTimeout(() => {
                dispatchEvent(
                  new CustomEvent(`${job.value.id}:update`, {
                    detail: job.value,
                  }),
                );
              }, 0);
            } catch (error) {
              console.log(error);
            } finally {
              status.value.loading = false;
            }
          },

          menuItems: computed(() => {
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
                    status.value.submit(item.value);
                  },
                };

                return i;
              });
          }),

          dropdown: computed(() => {
            const item: DropdownMenuItem = {
              loading: status.value.loading,
              label: Use.i18n.t(
                `job.items.status.items.${job.value.status}.label`,
              ),
              // icon: ApplyUtils.getStatusIcon(job.value, apply.value.status),
              children: status.value.menuItems.value,
              class: "cursor-pointer",
              disabled: Store.session.user?.role !== "admin",
            };

            return item;
          }),
        };

        menu.value.items = computed(() => {
          const statusItems = status.value.dropdown.value;
          statusItems.variant = "soft";
          statusItems.color = "neutral";
          // statusItems.notHide = true;

          const items: DropdownMenuItem[] = [statusItems];

          if (["admin", "recruiter"].includes(jobUser.value.role)) {
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
              to: Use.localePath({
                name: "job-id",
                params: { id: job.value.id },
              }),
            },
            {
              label: Use.i18n.t("job.actions.share_job"),
              icon: "i-lucide-send",
            },
          );

          if (jobUser.value.role === "admin") {
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

        applyStatus.value = {
          values: computed(() => {
            return job.value.applyStatus;
          }),

          filterBy: shallowRef(null),
          filterItems: computed(() => {
            const _items = [
              {
                value: null,
                label: Use.i18n.t(`apply.status.labels.all`),
                icon: "i-lucide-text",
              },
              ...job.value.applyStatus.map((status) => {
                return {
                  value: `status:${status.key}`,
                  label:
                    status.label ||
                    Use.i18n.t(`apply.status.${status.key}.label`),
                  icon: status.icon || applyStatusIcons[status.key],
                };
              }),
              {
                value: "status:null",
                label: Use.i18n.t(`apply.status.labels.null`),
                icon: applyStatusIcons.null,
              },
            ];

            const items = _items.map((status) => {
              return {
                ...status,
                class: "cursor-pointer",
                onSelect() {
                  applyStatus.value.filterBy.value = status.value;
                },
              };
            });

            return {
              children: items,
              label: _items.find(
                (status) => status.value === applyStatus.value.filterBy.value,
              )?.label,
              icon: _items.find(
                (status) => status.value === applyStatus.value.filterBy.value,
              )?.icon,
              variant: "ghost",
            } as DropdownMenuItem;
          }),

          async update(value) {
            try {
              const all = _.cloneDeep(job.value.applyStatus);
              const i = all.findIndex((a) => a.key === value.key);

              if (i === -1) all.push(value);
              else all[i] = value;

              job.value = await Api.$fetch<Job>(
                `/api/admin/job/${job.value.id}/apply-status`,
                { method: "post", body: { applyStatus: all } },
              );
            } catch (error) {
              console.log(error);
            }
          },

          async remove(key) {
            try {
              let all = _.cloneDeep(job.value.applyStatus);
              const i = all.findIndex((a) => a.key === key);
              all.splice(i, 1);

              job.value = await Api.$fetch<Job>(
                `/api/admin/job/${job.value.id}/apply-status`,
                { method: "post", body: { applyStatus: all } },
              );
            } catch (error) {
              console.log(error);
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

    instances.set(id, {
      job,
      jobUser,
      loading,
      status,
      menu,
      applyStatus,
      ready,
    });
  }

  return instances.get(id) as JobInstance;
};
