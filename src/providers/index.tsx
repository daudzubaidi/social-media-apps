"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { makeQueryClient } from "@/lib/query-client";
import { StoreProvider } from "@/store/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        {children}
        <Toaster position="top-right" richColors />
      </StoreProvider>
    </QueryClientProvider>
  );
}
