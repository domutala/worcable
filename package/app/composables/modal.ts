import type { IModalOptions, IModal } from "~/interfaces";
import { watchImmediate } from "@vueuse/core";
import { useRouteQuery } from "@vueuse/router";

const instances = new Map<string, IModal>();
const aliases: Record<string, string> = {};

export const useModal = ({
  uid,
  alias,
  onOpen,
  onClose,
  defaultValue = "open",
  force = false,
}: IModalOptions = {}) => {
  uid ||= Random({ length: 32 });
  uid = aliases[uid] || uid;

  if (force || !instances.has(uid)) {
    const open = computed({
      get: () => !!value.value,
      set: (val) => {
        if (val) value.value ||= defaultValue;
        else {
          if (value.value) Use.router.back();
        }
      },
    });

    const value = useRouteQuery<string | undefined>(uid, undefined, {
      mode: "push",
      transform(val) {
        return val;
      },
    });

    watchImmediate(
      () => open.value,
      () => {
        if (open.value) {
          onOpen?.();
        } else {
          if (value.value) Use.router.back();
          onClose?.();
        }
      },
    );

    if (alias) aliases[alias] = uid;

    instances.set(uid, { uid, open, value });
  }

  return instances.get(uid)!;
};
