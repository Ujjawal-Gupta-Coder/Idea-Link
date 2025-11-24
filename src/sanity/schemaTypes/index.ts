import { type SchemaTypeDefinition } from 'sanity'
import { author } from './author'
import { startup } from './startup'
import { comment } from './comment'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, startup, comment],
}
