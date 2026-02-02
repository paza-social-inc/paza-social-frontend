'use server'

import { cookies } from 'next/headers'

export async function setAuthToken(token: string) {
    const cookiesStore = await cookies();
    cookiesStore.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
    })
}
