import { defineField, defineType } from "sanity";

export const startup = defineType({
  name: "startup",
  title: "Startup",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
       validation: (Rule) =>
        Rule.required().error("Title is required")
        .min(3).error("Title must be at least 3 characters")
        .max(50).error("Title must be less than 50 characters"),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
       validation: (Rule) =>
        Rule.required().error("Author is required"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("Slug is required"),
    }),
    defineField({
      name: "views",
      title: "Views",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
       validation: (Rule) =>
        Rule.required().error("Description is required")
        .min(3).error("Description must be at least 3 characters")
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      validation: (Rule) =>
      Rule.required().error("Category is required")
      .min(3).error("Category must be at least 3 characters")
      .max(20).error("Category must be less than 20 characters"),
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      }
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [
        {
          type: "string",
          validation: (Rule) =>
            Rule.required().min(1).error("Keyword cannot be empty")
                .max(20).warning("Keep keywords under 20 characters"),
        },
      ],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "pitch",
      title: "Pitch",
      type: "markdown",
    }),
  ],
});
