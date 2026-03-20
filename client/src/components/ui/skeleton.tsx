// Copyright (c) 2023-2026 shadcn
// This file is part of shadcn/ui.
// Use of this source code is governed by the MIT license.

import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
