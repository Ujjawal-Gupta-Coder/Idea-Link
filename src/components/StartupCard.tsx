import {StartupCardType} from "@/types";
import { EyeIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { formatDate, getImageLink } from '@/lib/utils';
import ProfileAvatar from "./ProfileAvatar";
import StartupMenu from "./StartupMenu";

const StartupCard = ({ post, showMenu = false, forRecentView = false }: { post: StartupCardType, showMenu?: boolean, forRecentView?: boolean }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    image,
    description,
    slug,
    _id,
  } = post;

  return (
    <li className={`startup-card group ${forRecentView ? "flex-shrink-0 w-[300px] h-[450px] md:w-[330px] lg:w-[360px] list-none" : ""}`}>
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>

          {
            showMenu &&
             <StartupMenu slug={slug} startup_id={_id} email={author?.email}/>
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
