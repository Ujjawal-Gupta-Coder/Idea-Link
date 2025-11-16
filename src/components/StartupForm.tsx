"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send, X } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image";
import { redirect } from "next/navigation";
import { toast } from 'react-toastify';
import { useTheme } from "next-themes";
import { getImageLink } from "@/lib/utils";

type StartupForm = {
  title: string,
  description: string,
  category: string,
  slug?: string
};

type InitialValueType = {
  title: string|null,
  description: string|null,
  category: string|null,
  image: {
          asset?: {
            _ref: string;
            _type: "reference";
          }
        } | null
  pitch: string|null,
  slug: string|null,
  id: string|null,
  views: number|null
}

export default function StartupForm({isEditMode=false, initialValue=null}: {isEditMode?:boolean, initialValue?:InitialValueType|null}) {
  
    const { theme } = useTheme();
    const [pitch, setPitch] = useState(initialValue?.pitch ? initialValue.pitch : "");
    const [image, setImage] = useState<File|null> (null);
    const [existingImageUrl, setExistingImageUrl] = useState(isEditMode && initialValue?.image ? getImageLink(initialValue.image).url() : null);
    const [pitchGenerating, setPitchGenerating] = useState(false);

   const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StartupForm>({
    defaultValues: {
        title: initialValue?.title ? initialValue.title : "",
        description: initialValue?.description ? initialValue.description : "",
        category: initialValue?.category ? initialValue.category : "",
        slug: initialValue?.slug ? initialValue.slug : "",
    },
  });


  const onSubmit: SubmitHandler<StartupForm> = async (data) => {

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    if(image) formData.append("image", image);
    else if(!existingImageUrl && isEditMode) formData.append("image", "null");

    formData.append("pitch", pitch);
    if(isEditMode && initialValue) {
        formData.append("id", initialValue.id!);
        formData.append("views", String(initialValue.views));
        formData.append("slug", data.slug);
    } 
    let raw;
    if(!isEditMode) {
        raw = await fetch("/api/create-startup", {
        method: "POST",
        body: formData
      })
    } else {
      raw = await fetch("/api/edit-startup", {
        method: "PATCH",
        body: formData
      })
    }
    
    const response = await raw?.json(); 
    if(response?.success) {
      toast.success(response.message, { theme });
      redirect(`/startup/${response.data.slug}`);
    }
    else toast.error(response.message, { theme });
  } 

const handleDrop = (e: DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  const file = e.dataTransfer.files?.[0];
  if (file && file.type.startsWith("image/")) {
    setImage(file);
  }
};

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file && file.type.startsWith("image/")) {
    setImage(file);
  }
};

const handleEnhancePitch = async () => {
  try {
    setPitchGenerating(true);
  const {title, description, category} = getValues();
  const raw = await fetch("/api/enhanced-pitch", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({title, description, category, pitch})
  })
  const response = await raw.json();

  if(response.success) {
    setPitch(response.data);
    toast.success(response.message, {theme});
  } else {
    toast.error(response.message, {theme});
  }
  
   setPitchGenerating(false)
  } catch(e) {
      toast.error("Something went wrong while generating pitch", {theme});
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="startup-form">
   
      {/* TITLE  */}
      <div className="flex flex-col">
          <label className="startup-form_label">
          Title
          </label>
          <Input
          {...register("title", {
              required: {
                value: true,
                message: "Title is required",
              },
              validate: (value) => {
                const length = value.trim().length;
                if(length < 3) return "At least 3 non-space characters"
                else if(length > 50) return "At most 50 non-space characters"
                else return true;
              }
          })}
          className="startup-form_input"
          placeholder="Startup Title"
          />
          {errors.title && <p className="startup-form_error">{errors.title.message}</p>}
      </div>

      {/* DESCRIPTION  */}
      <div className="flex flex-col">
      <label htmlFor="title" className="startup-form_label">
          Description
      </label>
      <Textarea
        {...register("description", {
              required: {
                value: true,
                message: "Description is required",
              },
              validate: (value) => {
                if(value.trim().length < 3) return "At least 3 non-space characters"
                else return true;
              }
          })}
        className="startup-form_textarea"
        placeholder="Startup Description"
      />
      {errors.description && <p className="startup-form_error">{errors.description.message}</p>}
      </div> 

      {/* CATEGORY  */}
       <div className="flex flex-col">
        <label className="startup-form_label">
          Category
        </label>
        <Input
          {...register("category", {
              required: {
                value: true,
                message: "Category is required",
              },
              validate: (value) => {
                const length = value.trim().length;
                if(length < 3) return "At least 3 non-space characters"
                else if(length > 20) return "At most 20 non-space characters"
                else return true;
              }
          })}
          className="startup-form_input"
          placeholder="Startup Category (Tech, Health, Education...)"
        />
        {errors.category && <p className="startup-form_error">{errors.category.message}</p>}
      </div>  

      {/* URL SLUG  */}
      {
        isEditMode && initialValue &&
        <div className="flex flex-col">
        <label className="startup-form_label">
          URL Slug
        </label>
        <Input
          {...register("slug", {
              required: {
                value: true,
                message: "URL Slug is required",
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
          placeholder="Startup URL Slug"
        />
        {errors.slug && <p className="startup-form_error">{errors.slug.message}</p>}
      </div>
      }
       
      {/* IMAGE  */}
      <div>
        <label className="startup-form_label">
          Cover Image
        </label>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`startup-form_dropbox ${image? "border-blue-500 bg-blue-50 dark:bg-sky-800/50": "border-black"} `}
        >
        {
          (image || existingImageUrl) ? <>
            <div className="relative w-full h-48">
                <Image
                src={image ? URL.createObjectURL(image) : existingImageUrl}
                alt="Cover Image"
                fill
                className="object-cover rounded-md"
              />
            </div>
              
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setExistingImageUrl(null);
                }}
                className="absolute top-2 right-2 z-10 bg-black/60 text-white px-2 py-1 text-xs rounded-md"
              >
                <X/>
              </button>
            </> :
            <div className="flex flex-col items-center justify-center space-y-2 font-black">
              {/* Image Upload Animation  */}
              <svg
                className="w-20 h-20 text-gray-500 dark:text-gray-300"
                fill="none"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="8"
                  y="8"
                  width="48"
                  height="48"
                  rx="12"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="6"
                  className="animate-[pulse_2s_infinite]"
                />
                <path
                  d="M32 16v24m0 0-8-8m8 8 8-8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-[bounce_1.5s_infinite]"
                />
              </svg>
              
            <p className="text-sm md:text-lg text-gray-500">
                Drag & drop or click to select an image
                <br />
                Recommended aspect ratio: 16:9
              </p>
            </div>
        }

          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* PITCH  */}
      <div data-color-mode={"light"}>
        <label className="startup-form_label">
          Pitch
        </label>

        <MDEditor 
        className="mt-3"
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />

        
        <div className="w-full relative flex items-center justify-end">
          
          <Button disabled={pitchGenerating} className="mt-2 text-sm rounded-xl cursor-pointer bg-gradient-to-r from-sky-500 to-emerald-500 text-black font-semibold transition-all hover:scale-[1.03]" onClick={handleEnhancePitch} type="button"> 
              {
                pitchGenerating ? "Generating ..." : "Generate with AI"
              }
            
              <Image src={'/gemini_ai_icon.png'} alt="AI Icon" height={20} width={20} />
          </Button>
          
        </div>
      </div> 


      <Button
        type="submit"
        className="startup-form_btn text-white cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ?
         <>
            Submitting...
            <Spinner className="size-6" /> 
          </>
          :
          <>
            Submit Your Pitch
            <Send className="size-6 ml-2" />
          </> 
          }
      </Button>


    </form>
  )
}


