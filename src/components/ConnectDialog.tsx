"use client"

import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { useTheme } from "next-themes"
import emailjs from "@emailjs/browser";
import { useState } from "react"

type FormData = {
  subject: string
  message: string
}

type TemplateVariablesType = {
  subject: string,
  message: string,
  receiverName: string,
  receiverEmail: string,
  title: string,
  slug: string,
  senderName: string,
  senderEmail: string,
  senderProfileLink: string,
  startupLink: string,
}

export default function ConnectDialog({senderName, senderUsername, senderMail, receiverName, receiverMail, startupTitle, startupSlug} : {senderName:string|null, senderUsername:string|null, senderMail:string|null,receiverName: string|null, receiverMail:string|null, startupTitle:string|null, startupSlug:string|null}) {
  const {theme} = useTheme();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>()

  const handleSendMail = async(templateVariables: TemplateVariablesType) => {
  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!, 
      templateVariables,
      process.env.NEXT_PUBLIC_EMAILJS_API_KEY
    );
    toast.success("Email sent successfully", {theme});
    setOpen(false);
  } 
  catch {
    toast.error("Email sending failed", {theme});
  }
};


  const onSubmit = async (data: FormData) => {
    if(!senderName || !senderMail) {
      toast.error("You need to be signed in to send a message to the founder", {theme});
      reset();
      setOpen(false);
      return;
    }
    
    if(!receiverName || !startupSlug || !senderUsername || !receiverMail || !startupTitle)  {
      toast.error("Insufficient data for sending email", {theme});
      reset();
      setOpen(false);
      return;
    }

    if(receiverMail && receiverMail.endsWith("@example.com")) {
      toast.info("This is a demo account — email is turned off", {theme});
      reset();
      setOpen(false);
      return;
    }
      
    const templateVariables: TemplateVariablesType = {
      subject: data.subject,
      message: data.message,
      receiverName: receiverName!,
      receiverEmail: receiverMail!,
      title: startupTitle!,
      slug: startupSlug!,
      senderName: senderName!,
      senderEmail: senderMail!,
      senderProfileLink: `${process.env.NEXT_PUBLIC_BASE_URL}/user/${senderUsername}`,
      startupLink: `${process.env.NEXT_PUBLIC_BASE_URL}/startup/${startupSlug}`,
    }

    await handleSendMail(templateVariables);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-center w-full mt-6">
          <button className="startup_details_connect_btn">
            Connect with Founder
          </button>
        </div>
      </DialogTrigger>

      <DialogContent className="rounded-2xl bg-white max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Connect with the Founder
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            Your message will be securely delivered to the founder via{" "}
            <strong>Email.js</strong>.

            {
              senderMail && 
              <span className="ml-1">
                The founder will be able to reply directly
                to your registered email <b>{senderMail}</b>
              </span> 
            } 

          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Subject */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">
              Subject
            </label>
            <Input
              placeholder="e.g. Interested in your startup"
              className="rounded-xl"
              {...register("subject", { required: "Subject is required" })}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject.message}</p>
            )}
          </div>

          {/* Message */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">
              Message
            </label>
            <Textarea
              placeholder="Write your message here..."
              className="rounded-xl min-h-[150px]"
              {...register("message", { required: "Please enter your message" })}
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl cursor-pointer bg-gradient-to-r from-sky-500 to-emerald-500 text-black font-semibold transition-all hover:scale-[1.03]"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
