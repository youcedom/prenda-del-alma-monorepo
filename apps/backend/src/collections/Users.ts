import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
    slug: 'users',
    admin: {
        useAsTitle: 'email',
    },
    auth: {
        forgotPassword: {
            generateEmail: (args: any) => {
                const token = args?.token || '';
                // Use WEB_URL if set, otherwise fallback to standard dev URL
                const domain = process.env.WEB_URL || 'http://localhost:4200'
                const resetLink = `${domain}/reset-password/${token}`
                return {
                    subject: 'Reset Password',
                    html: resetLink,
                }
            },
        },
    } as any,
    fields: [
        {
            name: 'name',
            type: 'text',
        },
        {
            name: 'avatar',
            type: 'text', // Keeping as text for external URLs or base64 for now to match mock behavior
        },
        {
            name: 'bio',
            type: 'textarea',
        },
        {
            name: 'city',
            type: 'text',
        },
        {
            name: 'country',
            type: 'text',
        },
        {
            name: 'likedArtworks',
            type: 'relationship',
            relationTo: 'artworks',
            hasMany: true,
        },
        {
            name: 'savedEvents',
            type: 'relationship',
            relationTo: 'events',
            hasMany: true,
        },
        {
            name: 'followedArtists',
            type: 'relationship',
            relationTo: 'artists',
            hasMany: true,
        },
        {
            name: 'followedGalleries',
            type: 'relationship',
            relationTo: 'galleries',
            hasMany: true,
        },
    ],
}
