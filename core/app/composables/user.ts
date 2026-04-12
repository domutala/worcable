import type { DropdownMenuItem } from "@nuxt/ui";
import type { ShallowRef } from "vue";
import type { IModal } from "~/interfaces";
import type { User } from "~~/server/database/collections";

type UserMenuInstance = { items: ComputedRef<DropdownMenuItem[]> };

export type UserInstance = {
  ready: ShallowRef<boolean>;
  user: ShallowRef<User>;
  loading: ShallowRef<boolean>;
  menu: ShallowRef<UserMenuInstance>;
  canEdit: ComputedRef<boolean>;
  modal: {
    active: IModal;
    role: IModal;
    remove: IModal;
  };
};

const instances = new Map<string, UserInstance>();

export const useUser = (
  id: string,
  {
    onReady,
    force = false,
    notInit = false,
  }: { onReady?: () => void; force?: boolean; notInit?: boolean } = {},
) => {
  const isSet = instances.get(id);

  const ready = shallowRef(false);
  const loading = shallowRef(false);
  const user = shallowRef<User>(null as any);
  const menu = shallowRef(null as any);
  const modal = {
    active: useModal(),
    role: useModal(),
    remove: useModal(),
  };

  const canEdit = computed(() => {
    return (
      Store.session.user?.role === "admin" &&
      user.value.id !== Store.session.user?.id
    );
  });

  async function init() {
    loading.value = true;

    try {
      user.value = await Api.$fetch<User>(`/api/admin/user/${id}`);

      menu.value = {
        items: computed(() => {
          const items: DropdownMenuItem[] = [];

          if (canEdit.value) {
            items.push(
              {
                label: Use.i18n.t("user.labels.update_role"),
                icon: "i-lucide-shield-user",
                onSelect() {
                  modal.role.open.value = true;
                },
              },

              {
                label: Use.i18n.t(
                  user.value.active ? "words.to_deactive" : "words.to_active",
                ),
                icon: user.value.active
                  ? "i-lucide-user-round-minus"
                  : "i-lucide-user-round-check",
                onSelect() {
                  modal.active.open.value = true;
                },
              },

              {
                label: Use.i18n.t("words.to_remove"),
                icon: "i-lucide-trash-2",
                color: "error",
                onSelect() {
                  modal.remove.open.value = true;
                },
              },
            );
          }

          return items;
        }),
      };
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
      ready.value = true;

      onReady?.();
    }
  }

  if (!isSet || force) {
    instances.set(id, {
      user,
      loading,
      menu,
      ready,
      modal,
      canEdit,
    });
  }

  if ((!notInit && !isSet) || force) init();
  else onReady?.();

  return instances.get(id)!;
};
