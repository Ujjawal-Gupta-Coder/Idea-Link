import {StartupCardType} from "@/types";
import { Edit, EllipsisVertical, EyeIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { formatDate, getImageLink } from '@/lib/utils';
import ProfileAvatar from "./ProfileAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

const StartupCard = ({ post, showMenu = false }: { post: StartupCardType, showMenu?: boolean }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    image,
    description,
    slug
  } = post;

  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>

          {
            showMenu && 
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <EllipsisVertical className="cursor-pointer" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="bg-white-100 text-black border-2 shadow-sm z-10 rounded-2xl p-2">
                
                <DropdownMenuItem className="flex items-center cursor-pointer hover:bg-neutral w-full px-4 py-2 rounded-2xl border-node">
                  <Edit className="mr-2 h-4 w-4" /> 
                  <Link href={`/startup/edit/${slug}`} >Edit</Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center cursor-pointer hover:bg-red-500 w-full px-4 py-2 rounded-2xl">
                  <Trash2 className="mr-2 h-4 w-4" /> 
                  <button>Delete</button>
                </DropdownMenuItem>
              
              </DropdownMenuContent>
              
            </DropdownMenu>
          }

        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author?.username}`}>
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          </Link>
          <Link href={`/startup/${slug}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>

        <Link href={`/user/${author?.username}`}>
          <ProfileAvatar image={author?.image} name={author?.name} />
        </Link>
      </div>

      <Link href={`/startup/${slug}`}>
        <p className="startup-card_desc">{description}</p>

        <div className='relative startup-card_img'>
            <Image src={image ? getImageLink(image).url() : "/no-image-placeholder.png"} alt="Pitch Image" fill />
        </div>
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        <Button className="startup-card_btn">
          <Link href={`/startup/${slug}`}>Details</Link>
        </Button>
      </div>
    </li>
  )
}

export default StartupCard
