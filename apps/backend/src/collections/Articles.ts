import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
    slug: 'articles',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'category',
            type: 'text',
        },
        {
            name: 'author',
            type: 'text',
        },
        {
            name: 'date',
            type: 'date',
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'summary',
            type: 'textarea',
        },
        {
            name: 'content',
            type: 'richText',
        },
        {
            name: 'featured',
            type: 'checkbox',
            defaultValue: false,
        },
    ],
}
