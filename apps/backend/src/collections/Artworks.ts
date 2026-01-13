import type { CollectionConfig } from 'payload'

export const Artworks: CollectionConfig = {
    slug: 'artworks',
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
            name: 'artist',
            type: 'relationship',
            relationTo: 'artists',
            required: true,
        },
        {
            name: 'gallery',
            type: 'relationship',
            relationTo: 'galleries',
        },
        {
            name: 'year',
            type: 'number',
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'medium',
            type: 'text',
        },
        {
            name: 'dimensions',
            type: 'text',
        },
        {
            name: 'category',
            type: 'text', // In a real app this might be a relationship to a Categories collection
        },
        {
            name: 'description',
            type: 'textarea',
        },
        {
            name: 'likes',
            type: 'number',
            defaultValue: 0,
        },
    ],
}
