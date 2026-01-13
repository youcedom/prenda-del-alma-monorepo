import type { CollectionConfig } from 'payload'

export const Galleries: CollectionConfig = {
    slug: 'galleries',
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
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'description',
            type: 'textarea',
        },
        {
            name: 'type',
            type: 'select',
            options: [
                { label: 'Gallery', value: 'Gallery' },
                { label: 'Museum', value: 'Museum' },
            ],
            defaultValue: 'Gallery',
        },
        {
            name: 'institutionType',
            type: 'text',
            admin: {
                condition: (data) => data.type === 'Museum',
            },
        },
    ],
}
