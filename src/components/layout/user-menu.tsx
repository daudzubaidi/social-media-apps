"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/config/routes";
import { useLogout } from "@/services/queries/auth";

interface UserMenuProps {
  avatarUrl?: string;
  name?: string;
}

export function UserMenu({ avatarUrl, name }: UserMenuProps) {
  const router = useRouter();
  const logout = useLogout();

  function handleLogout() {
    if (logout.isPending) return;

    logout.mutate(undefined, {
      onSuccess: () => {
        router.replace(ROUTES.LOGIN);
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="size-8 cursor-pointer">
            <AvatarImage src={avatarUrl} alt={name || "User"} />
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => router.push(ROUTES.ME)}>
          <User className="mr-2 size-4" />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} disabled={logout.isPending}>
          <LogOut className="mr-2 size-4" />
          {logout.isPending ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
