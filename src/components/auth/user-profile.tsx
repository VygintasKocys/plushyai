"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Wand2 } from "lucide-react";
import { CreditBadge } from "@/components/credit-badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "@/lib/auth-client";
import { MOCK_USER } from "@/lib/mock-data";

interface UserProfileProps {
  mockMode?: boolean;
}

export function UserProfile({ mockMode = false }: UserProfileProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const useMock = mockMode;
  const user = useMock
    ? { name: MOCK_USER.name, email: MOCK_USER.email, image: MOCK_USER.image }
    : session?.user;
  const credits = MOCK_USER.credits;

  if (!useMock && isPending) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }

  if (!useMock && !session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm">Sign up</Button>
        </Link>
      </div>
    );
  }

  const handleSignOut = async () => {
    if (!useMock) {
      await signOut();
    }
    router.replace("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-8 cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage
            src={user?.image || ""}
            alt={user?.name || "User"}
            referrerPolicy="no-referrer"
          />
          <AvatarFallback>
            {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            <CreditBadge credits={credits} />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/generate" className="flex items-center">
            <Wand2 className="mr-2 h-4 w-4" />
            Generate
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Your Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
