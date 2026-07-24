import { groq } from '@sanity/sveltekit';

export const reviewsQuery = groq`*[_type == "review"] | order(date desc){
  _id, author_name, rating, date, text
}`;

export const portfolioPreviewQuery = groq`*[_type == "project"] | order(year desc, order asc)[0...3]{
  _id, title, slug, year, url, image, tags, description_nl, description_en
}`;

export const portfolioAllQuery = groq`*[_type == "project"] | order(year desc, order asc){
  _id, title, slug, year, url, image, tags, description_nl, description_en
}`;

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id, publishedAt, title, slug, excerpt, mainImage
}`;

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  _id, publishedAt, title, slug, excerpt, mainImage, body
}`;
