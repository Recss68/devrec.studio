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
  _id, publishedAt, slug, mainImage,
  title_nl, title_en,
  excerpt_nl, excerpt_en,
  "wordCount": length(string::split(pt::text(coalesce(body_nl, body_en)), " "))
}`;

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  _id, publishedAt, slug, mainImage,
  title_nl, title_en,
  excerpt_nl, excerpt_en,
  body_nl, body_en,
  "wordCount": length(string::split(pt::text(coalesce(body_nl, body_en)), " "))
}`;
