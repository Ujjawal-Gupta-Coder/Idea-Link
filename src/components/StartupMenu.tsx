'use client'

import Link from "next/link"
import { EllipsisVertical, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "react-toastify"
import { useTheme } from "next-themes"

const StartupMenu = ({slug, startup_id, email }: {slug:string, startup_id:string, email:string }) => {
  const { theme } = useTheme();

  const handleDelete = async () => {
    const raw = await fetch("/api/delete-startup", {
      method: "DELETE",
      body: JSON.stringify({startup_id, email}),
      headers: {
        "content-type": "application/json",
      }
     })
    const response = await raw.json();

    if(response.success) {
      toast.success(response.message, {theme})
    }
   else toast.error(response.message, {theme})
  }
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="cursor-pointer" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-white-100 text-black border-2 shadow-sm z-10 rounded-2xl p-2"
        >
          {/* Edit */}
          <Link href={`/startup/edit/${slug}`} className="flex items-center cursor-pointer hover:bg-neutral/50 w-full px-4 py-2 rounded-2xl">
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </Link>

          {/* Delete */}
          <AlertDialogTrigger asChild>
            <div className="flex items-center text-red-600 cursor-pointer hover:bg-red-200 w-full px-4 py-2 rounded-2xl">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </div>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <AlertDialogContent className="bg-white-100 shadow-2xl text-black rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently delete this startup.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl cursor-pointer hover:bg-primary-100">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 rounded-xl text-white cursor-pointer"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default StartupMenu
