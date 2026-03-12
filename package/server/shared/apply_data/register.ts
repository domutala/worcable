import * as z from "zod";
import { ApplyDataOptions } from "./types";

import {
  availability,
  avatar,
  cv,
  desiredGrossSalary,
  educationLevel,
  email,
  firstName,
  lastName,
  motivation,
  phone,
} from "./items";

export function registerApplyData(key: string, options: ApplyDataOptions) {
  const isKeyValid = z
    .string()
    .min(2)
    .max(64)
    // .regex(/^[a-zA-Z0-9_-]$/)
    .safeParse(key).success;

  if (!isKeyValid) return;

  const i = applyDataOptionsList.findIndex((a) => a.key === key);
  if (i !== -1) applyDataOptionsList[i] = { ...options, key };
  else applyDataOptionsList.push({ ...options, key });
}

function registerApplyNative() {
  registerApplyData("avatar", avatar);
  registerApplyData("firstName", firstName);
  registerApplyData("lastName", lastName);
  registerApplyData("email", email);
  registerApplyData("phone", phone);
  registerApplyData("cv", cv);
  registerApplyData("desiredGrossSalary", desiredGrossSalary);
  registerApplyData("availability", availability);
  registerApplyData("educationLevel", educationLevel);
  registerApplyData("motivation", motivation);
}

export function initApplyData() {
  registerApplyNative();
}
