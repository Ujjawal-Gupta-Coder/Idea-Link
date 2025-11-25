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
  keywords,
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


export const RECOMMENDED_STARTUP_QUERY = (keywords: string[], id:string|null = null, limit: number = 5) => {
  
  const countScript = keywords.map((_, i) => {
    return `count(keywords[@ match $word${i+1}])>0`
  }).join(" || ");

  const orderScript = keywords.map((_, i) => {
    return `count(keywords[@ match $word${i+1}])`
  }).join(" + ");

  const params: {
    id: string|null,
    limit: number,
    [key: `word${number}`]: string
  } = {
    id: id,
    limit,
  }

  keywords.forEach((word, i) => {
    params[`word${i+1}`] = `*${word}*`;
  })

  const query = `
  *[_type == "startup" && 
    ($id == null || _id != $id) &&
    (${countScript})
  ] 
  |
  order(
    (${orderScript})
    desc
  ) [0...$limit]
  {
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
    keywords,
    views
  }
`;

  return {
    query: defineQuery(query), 
    params
  };
}
  


export const MOST_VIEWED_STARTUP_QUERY = 
defineQuery(`*[_type == "startup"] {
   _createdAt,
  views,
  author-> {
    name, image, bio, username, _id, email
  },
  title,
  category,
  image,
  description,
  slug,
  _id,
}
| order(views desc)[0...5]`);


export const KEYWORDS_FROM_STARTUP_ID_QUERY = 
defineQuery(`*[_type == "startup" && _id in $ids] {
  keywords
}
`);

export const FETCH_COMMENTS_BY_STARTUP_ID = 
defineQuery(`
  *[_type=="comment" && startup._ref == $id] | order(_createdAt desc) {
    _id,
    _createdAt,
    author -> {
      _id, name, image, username
    },
    message
  }
`);