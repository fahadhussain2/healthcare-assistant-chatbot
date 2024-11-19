"use client";

import { useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";

import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { BetterTooltip } from "@/components/ui/tooltip";
import { PlusIcon } from "./icons";
import { useSidebar } from "./ui/sidebar";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

export function ChatHeader() {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  const { user } = useUser();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />
      {(!open || windowWidth < 768) && (
        <BetterTooltip content="New Chat">
          <Button
            variant="outline"
            className="md:px-2 px-2 md:h-fit ml-auto md:ml-0"
            onClick={() => {
              router.push("/");
              router.refresh();
            }}
          >
            <PlusIcon />
            <span className="md:sr-only">New Chat</span>
          </Button>
        </BetterTooltip>
      )}
      {!user && (
        <Button className="md:h-fit md:ml-auto order-3 px-2" asChild>
          <Link href="/api/auth/login">Login</Link>
        </Button>
      )}
    </header>
  );
}
