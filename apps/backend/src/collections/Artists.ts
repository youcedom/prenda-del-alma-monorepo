import type { CollectionConfig } from 'payload'

export const Artists: CollectionConfig = {
    slug: 'artists',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'country', 'type'],
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
            name: 'country',
            type: 'text',
        },
        {
            name: 'birthYear',
            type: 'number',
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'bio',
            type: 'textarea',
        },
        {
            name: 'disciplines',
            type: 'array',
            fields: [
                {
                    name: 'name',
                    type: 'text',
                },
            ],
        },
        {
            name: 'movements',
            type: 'array',
            fields: [
                {
                    name: 'name',
                    type: 'text',
                },
            ],
        },
        {
            name: 'type',
            type: 'select',
            options: [
                { label: 'Individual', value: 'Individual' },
                { label: 'Collective', value: 'Collective' },
            ],
            defaultValue: 'Individual',
        },
    ],
}
