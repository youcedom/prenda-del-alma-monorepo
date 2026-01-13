import config from '../../../payload.config'
import '@payloadcms/next/css'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap'
import React from 'react'
import { ServerFunctionClient } from 'payload'

/* DO NOT MODIFY IT. BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

type Args = {
    children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
    'use server'
    return handleServerFunctions({
        ...args,
        config,
        importMap,
    })
}

const Layout = ({ children }: Args) => (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
        {children}
    </RootLayout>
)

export default Layout
