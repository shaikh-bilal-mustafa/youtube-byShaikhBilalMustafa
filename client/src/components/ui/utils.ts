// Copyright (c) 2023-2026 shadcn
// This file is part of shadcn/ui.
// Use of this source code is governed by the MIT license.

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
