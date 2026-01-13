import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { Artists } from './src/collections/Artists'
import { Galleries } from './src/collections/Galleries'
import { Artworks } from './src/collections/Artworks'
import { Events } from './src/collections/Events'
import { Articles } from './src/collections/Articles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
    },
    cors: [
        'http://localhost:4200',
        'http://localhost:3000',
        'https://prendadelalma.com',
        'https://www.prendadelalma.com',
        'https://staging-web.prendadelalma.com',
        'https://api.prendadelalma.com',
        'https://staging-api.prendadelalma.com',
        process.env.PAYLOAD_PUBLIC_SERVER_URL || ''
    ].filter(Boolean),
    csrf: [
        'http://localhost:4200',
        'http://localhost:3000',
        'https://prendadelalma.com',
        'https://www.prendadelalma.com',
        'https://staging-web.prendadelalma.com',
        'https://api.prendadelalma.com',
        'https://staging-api.prendadelalma.com',
        process.env.PAYLOAD_PUBLIC_SERVER_URL || ''
    ].filter(Boolean),
    serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    collections: [Users, Media, Artists, Galleries, Artworks, Events, Articles],
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || 'YOUR_SECRET_HERE',
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db: postgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URI || '',
        },
    }),
    // @ts-expect-error: Payload types mismatch with runtime requirement
    email: async () => {
        return {
            defaultFromAddress: 'info@prendadelalma.com',
            defaultFromName: 'Prenda del Alma',
            name: 'loops',
            sendEmail: async (message: any) => {
                if (!process.env.LOOPS_API_KEY) {
                    console.warn('LOOPS_API_KEY not set. Email not sent.')
                    return
                }
                const { LoopsClient } = await import('loops')
                // @ts-ignore
                const loops = new LoopsClient({ apiKey: process.env.LOOPS_API_KEY || '' })

                try {
                    // Logic to handle Password Reset specific email
                    if (message.subject === 'Reset Password') {
                        const transactionalId = process.env.LOOPS_TRANSACTIONAL_ID_PW_RESET
                        if (transactionalId) {
                            await loops.sendTransactionalEmail({
                                transactionalId,
                                email: message.to,
                                dataVariables: {
                                    url: message.html as string, // We are passing the raw URL in the html field from Users.ts
                                    token: (message.html as string).split('/').pop() || '' // Also sending token just in case
                                }
                            })
                            return
                        } else {
                            console.warn('LOOPS_TRANSACTIONAL_ID_PW_RESET not set. Password reset email not sent.')
                        }
                    }

                    // Fallback for other emails (if any generic one is set)
                    const genericTransactionalId = process.env.LOOPS_TRANSACTIONAL_ID

                    if (genericTransactionalId) {
                        await loops.sendTransactionalEmail({
                            transactionalId: genericTransactionalId,
                            email: message.to,
                            dataVariables: {
                                subject: message.subject,
                                body: message.text || message.html as string
                            }
                        })
                    } else {
                        console.warn('LOOPS_TRANSACTIONAL_ID not set. Generic email not sent.')
                    }
                } catch (error) {
                    console.error('Error sending email via Loops:', error)
                }
            },
        }
    },
    sharp,
    plugins: [
        // Add plugins here
    ],
})
