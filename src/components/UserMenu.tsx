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
import {Session} from "@/types/Session";
import Link from "next/link";
import SignOut from "./SignOut";
import { getFallbackAvatar } from "@/lib/utils";


export default function UserMenu({session}: {session: Session}) {
    
  return (
    <DropdownMenu >
          <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full p-0 w-10 h-10 hover:ring-2 hover:ring-secondary">
          <Avatar className="size-10 cursor-pointer">
              <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
              <AvatarFallback> {getFallbackAvatar(session.user?.name || "") || "AA"} </AvatarFallback>
            </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl bg-white-100 pb-2">
        <DropdownMenuLabel> My Account </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="hover:bg-primary-100 rounded-xl">
          <User className="mr-2 h-4 w-4" /> <Link href={"/user-profile"} >Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-primary-100 rounded-xl">
          <PenLine className="mr-2 h-4 w-4" /> <Link href={"/startup/create"} >Create Post</Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-xl">
           <LogOut className="mr-2 h-4 w-4" /> <SignOut />
        </DropdownMenuItem>

      </DropdownMenuContent>
      
    </DropdownMenu>
  );
}


