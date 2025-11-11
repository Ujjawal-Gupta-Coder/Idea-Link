import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY =
  defineQuery(`*[_type == "startup" && 
    (
      !defined($query) ||
      lower(title) match "*" + lower($query) + "*" ||
      lower(category) match "*" + lower($query) + "*" ||
      lower(author->name) match "*" + lower($query) + "*"
    )
  ] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    name, image, username
  }, 
  views,
  description,
  category,
  image,
}`);

export const STARTUP_BY_SLUG_QUERY = defineQuery(`*[_type == "startup" && slug == $slug][0]{
  _createdAt,
  _id,
  author -> {
    name, image, bio, username, _id, email
  },
  category,
  description,
  image,
  pitch,
  slug,
  title,
  views
} `) 

export const STARTUP_VIEWS_BY_ID_QUERY = defineQuery(`
  *[_type == "startup" && _id == $id][0]{
    _id, views
  }
`);

export const AUTHOR_BY_EMAIL_QUERY = defineQuery(`
*[_type == "author" && email == $email][0] {
  _id,
  name,
  email,
  username,
  image,
  bio
}
`);

export const AUTHOR_BY_USERNAME_QUERY = defineQuery(`
*[_type == "author" && username == $username][0] {
  _id,
  name,
  email,
  username,
  image,
  bio
}
`);

export const AUTHOR_BY_ID_QUERY = defineQuery(`
*[_type == "author" && _id == $id][0] {
  _id,
  name,
  email,
  username,
  image,
  bio
}
`);


export const STARTUPS_BY_AUTHOR_QUERY =
  defineQuery(`*[_type == "startup" && author._ref == $id] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio, username, email
  }, 
  views,
  description,
  category,
  image,
}`);


export const AUTHOR_BY_STARTUP_ID_QUERY =
  defineQuery(`*[_type=="startup" && _id == $id][0] {
  author -> {
    _id, email, name, username
  } 
}
`);

