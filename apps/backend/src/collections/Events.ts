import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
    slug: 'events',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'location',
            type: 'text',
        },
        {
            name: 'startDate',
            type: 'date',
        },
        {
            name: 'endDate',
            type: 'date',
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'type',
            type: 'text',
        },
        {
            name: 'rawDate',
            type: 'text', // Keeping for legacy compatibility if needed, though startDate is better
        },
        {
            name: 'description',
            type: 'textarea',
        },
        {
            name: 'gallery',
            type: 'relationship',
            relationTo: 'galleries',
        },
    ],
}
