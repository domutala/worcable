export type IModal = {
  uid: string;
  open: Ref<boolean>;
  value: Ref<string | undefined>;
};

export type IModalOptions = {
  uid?: string;
  alias?: string;
  onOpen?(): void;
  onClose?(): void;
  defaultValue?: string;
  force?: boolean;
};
