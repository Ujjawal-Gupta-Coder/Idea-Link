import { defineField, defineType } from "sanity";
import { UserIcon } from "lucide-react";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("Name is required")
        .min(3).error("Name must be at least 3 characters")
        .max(20).error("Name must be less than 20 characters"),
    }),
    defineField({
      name: "username",
      title: "Username",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("Username is required")
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("Email is required").email() 
    }),
    defineField({
      name: "image",
      title: "Profile Picture",
      type: "image",
      options: {
        hotspot: true,
      }
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
    }),
  ],
});
