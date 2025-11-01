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

type StartupForm = {
  title: string,
  description: string,
  category: string,
};


export default function StartupForm() {
    const [pitch, setPitch] = useState("");
    const [image, setImage] = useState<File|null> (null);
   const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StartupForm>({
    defaultValues: {
        title: "",
        description: "",
        category: "",
    },
  });

  const onSubmit: SubmitHandler<StartupForm> = (data) => {

    console.log("data ",data)
    console.log("image: ",image)
    console.log("pitch: ",pitch)
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
                if(value.trim().length < 3) return "At least 3 non-space characters"
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
                if(value.trim().length < 3) return "At least 3 non-space characters"
                else return true;
              }
          })}
          className="startup-form_input"
          placeholder="Startup Category (Tech, Health, Education...)"
        />
        {errors.category && <p className="startup-form_error">{errors.category.message}</p>}
      </div>  

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
        
          {image ? (
            <>
            <div className="relative w-full h-48">
                <Image
                src={URL.createObjectURL(image)}
                alt="Cover Image"
                fill
                className="object-cover rounded-md"
              />
            </div>
              
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                }}
                className="absolute top-2 right-2 z-10 bg-black/60 text-white px-2 py-1 text-xs rounded-md"
              >
                <X/>
              </button>
            </>
          ) : (
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
          )}

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


