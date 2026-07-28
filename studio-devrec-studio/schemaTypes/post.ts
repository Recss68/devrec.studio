import {defineType, defineField} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publicatiedatum',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Hoofdafbeelding',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'excerpt',
      title: 'Samenvatting',
      type: 'text',
      rows: 3,
      description: 'Korte beschrijving voor overzichtspagina en SEO',
    }),
    defineField({
      name: 'body',
      title: 'Inhoud',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', title: 'Alt tekst', type: 'string'}),
            defineField({name: 'caption', title: 'Bijschrift', type: 'string'}),
          ],
        },
      ],
    }),
  ],
  orderings: [
    {
      title: 'Publicatiedatum (nieuwste eerst)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'publishedAt', media: 'mainImage'},
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString('nl-NL') : 'Niet gepubliceerd',
        media,
      }
    },
  },
})
