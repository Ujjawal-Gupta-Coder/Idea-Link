'use client'
import { useForm, SubmitHandler } from "react-hook-form"
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { Edit, Send, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { getImageLink } from '@/lib/utils';
import Image from 'next/image';
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import { useTheme } from "next-themes";

type ProfileForm = {
  name: string,
  username: string,
  bio: string
};

type ProfileFormUser = {
    _id: string
  name: string,
  email: string,
  username: string,
  image?: {
          asset?: {
            _ref: string;
            _type: "reference";
          }
        } | null,
  bio?: string | null
}

const ProfileForm = ({user}: {user: ProfileFormUser}) => {
    const { theme } = useTheme();
    const [image, setImage] = useState<File|null> (null);
    const imagePickerRef = useRef(null);
    const [existingImageUrl, setExistingImageUrl] = useState(user?.image ? getImageLink(user.image).url() : null);

  const handleClearImage = () => {
    setExistingImageUrl(null);
    setImage(null);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file && file.type.startsWith("image/")) {
    setImage(file);
  }
};

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
      } = useForm<ProfileForm>({
        defaultValues: {
            name: user.name || "",
            username: user.username || "",
            bio: user.bio || "",
        },
      });

    const onSubmit: SubmitHandler<ProfileForm> = async (data) => {
    
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("username", data.username);
        formData.append("bio", data.bio);

        if(image) formData.append("image", image);
        else if(!existingImageUrl) formData.append("image", "null");
    
        formData.append("id", user._id);

         const raw = await fetch("/api/edit-user", {
            method: "PATCH",
            body: formData
          })
        
        
        const response = await raw?.json(); 
        if(response?.success) {
          toast.success(response.message, { theme });
          redirect(`/user/${response.data.username}`);
        }
        else toast.error(response.message, { theme });
      } 

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="startup-form">
   
      {/* NAME  */}
      <div className="flex flex-col">
          <label className="startup-form_label">
          Name
          </label>
          <Input
          {...register("name", {
              required: {
                value: true,
                message: "Name is required",
              },
              validate: (value) => {
                const length = value.trim().length;
                if(length < 3) return "At least 3 non-space characters"
                else if(length > 20) return "At most 20 non-space characters"
                else return true;
              }
          })}
          className="startup-form_input"
          placeholder="Enter your name"
          />
          {errors.name && <p className="startup-form_error">{errors.name.message}</p>}
      </div>

        {/* EMAIL  */}
        <div className="flex flex-col">
          <label className="startup-form_label">
          Email    
          </label>
          <span className="startup-form_input h-[50px] flex items-center"> 
          {user.email}
          </span>
           <p className="mt-2 ml-5 text-primary">Email updates are disabled for security purposes</p>
      
        </div>

    {/* USERNAME  */}
      <div className="flex flex-col">
        <label className="startup-form_label">
          Username
        </label>
        <Input
          {...register("username", {
              required: {
                value: true,
                message: "Username is required",
              },
              validate: (value) => {
                const trimmed = value!.trim();
                const length = trimmed.length;
                if(length < 3) return "At least 3 non-space characters"
                if(length > 20) return "At most 20 non-space characters"

                if(trimmed == "create" || trimmed == "edit") return "Keywords are not allowed"
                
                const regex = /^[a-z0-9_\-~]+$/;
                if (!regex.test(value!))
                return "Only lowercase letters, numbers, _, -, and ~ are allowed";

                return true;
              }
          })}
          className="startup-form_input"
          placeholder="Username"
        />
        {errors.username && <p className="startup-form_error">{errors.username.message}</p>}
      </div>


      {/* BIO */}
      <div className="flex flex-col">
      <label htmlFor="title" className="startup-form_label">
          Bio
      </label>
      <Textarea
        {...register("bio", {
              validate: (value) => {
                if(value && value.trim().length < 3) return "At least 3 non-space characters"
                else return true;
              }
          })}
        className="startup-form_textarea"
        placeholder="Tell us about yourself"
      />
      {errors.bio && <p className="startup-form_error">{errors.bio.message}</p>}
      </div> 

      
      {/* PROFILE PICTURE  */}
      <div className="flex flex-col gap-4">
        <label className="startup-form_label">
          Profile Picture
        </label>

        <div className='flex justify-center items-center w-full'>
          <div className='relative'>
              <div className='relative h-[300px] w-[300px] rounded-full overflow-hidden border-[3px] border-black flex justify-center items-center cursor-pointer'>
                <Image src={image ? URL.createObjectURL(image) : existingImageUrl ? existingImageUrl : '/user-placeholder.png'} alt='Profile Picture' fill className='object-fit' />
                <Input
                type='file'
                onChange={handleImageChange}
                className='opacity-0 absolute inset-0  w-full h-full cursor-pointer'
                ref={imagePickerRef}
              />
              </div>

              {
                (image || existingImageUrl) && 
                <X  className="absolute top-5 right-5 z-10 bg-black/90 text-white px-2 py-1 size-[40px] rounded-2xl cursor-pointer hover:bg-primary" onClick={handleClearImage} />
              }
              <Edit className="absolute bottom-5 right-5 z-10 bg-black/90 text-white px-2 py-1 size-[40px] rounded-2xl cursor-pointer hover:bg-primary" onClick={() => imagePickerRef.current?.click()}/>
              
          </div>
           </div>
       
          
      </div>

      
      <Button
        type="submit"
        className="startup-form_btn text-white cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ?
         <>
            Updating...
            <Spinner className="size-6" /> 
          </>
          :
          <>
            Update Profile
            <Send className="size-6 ml-2" />
          </> 
          }
      </Button>

    </form>
  )
}

export default ProfileForm
