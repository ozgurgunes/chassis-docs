import { getCollection, getEntry } from 'astro:content'

export const blogPages = await getCollection('blog')
