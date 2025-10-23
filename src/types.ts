import { Author, Startup } from "./sanity/types"

export type Session = {

    user: {
    name: 'string',
    email: 'string',
    image: 'string'
  },
  expires: 'string'
}


export type StartupCardType = Omit<Startup, "author"> & {author?: Author}