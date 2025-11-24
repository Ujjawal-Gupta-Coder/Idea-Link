import { defineField, defineType } from "sanity";
import { MessageCircleMore } from 'lucide-react';

export const comment = defineType({
    name: "comment",
    title: "Comment",
    type: "document",
    icon: MessageCircleMore,
    fields: [
        defineField({
            name: "startup",
            title: "Startup",
            type: "reference",
            to: { type: "startup" },
            validation: (Rule) =>
                Rule.required().error("Startup is required"),
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
            name: "message",
            title: "Message",
            type: "string",
            validation: (Rule) =>
                Rule.required().error("Message is required"),
        }),
    ]
})