// Copyright (c) 2023-2026 shadcn
// This file is part of shadcn/ui.
// Use of this source code is governed by the MIT license.

"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
