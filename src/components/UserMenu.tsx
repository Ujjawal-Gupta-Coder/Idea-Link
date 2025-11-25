'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, PenLine } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { getFallbackAvatar, getImageLink } from "@/lib/utils";
import { AUTHOR_BY_EMAIL_QUERYResult } from "@/sanity/types";
import { signOut } from "next-auth/react";
import { useState } from "react";


export default function UserMenu({user}: {user: AUTHOR_BY_EMAIL_QUERYResult}) {
    const [open, setOpen] = useState(false);

    const handleSignOut = async () => {
      await signOut();
    }

    const closeDialog = () => {
      setOpen(false);
    }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full p-0 w-10 h-10 hover:ring-2 hover:ring-secondary">
          <Avatar className="size-10 cursor-pointer border-2 border-accent">
              <AvatarImage src={user?.image ? getImageLink(user.image).url(): undefined} alt={user?.name || ""} />
              <AvatarFallback> {getFallbackAvatar(user?.name || "") || "AA"} </AvatarFallback>
            </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl bg-white-100 pb-2">
        <DropdownMenuLabel> My Account </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="hover:bg-primary-100 rounded-xl" onClick={closeDialog}>
          <User className="mr-2 h-4 w-4" /> <Link href={`/user/${user!.username}`} >Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-primary-100 rounded-xl" onClick={closeDialog}>
          <PenLine className="mr-2 h-4 w-4" /> <Link href={"/startup/create"} >Create Post</Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border" />

        <div className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-xl flex justify-start items-center gap-1 px-2 h-8 mt-2">
           <LogOut className="mr-2 h-5 w-5" /> 
           <button className="cursor-pointer" onClick={handleSignOut} >Sign Out</button>
        </div>

      </DropdownMenuContent>
      
    </DropdownMenu>
  );
}


