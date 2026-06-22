'use server'

import { cookies } from 'next/headers'

// Mirrors the backend JWT lifetime (auth.controller signs tokens with
// expiresIn: "1d"). Keeping the cookie's max-age in sync avoids a stale
// cookie outliving the token (or vice-versa).
const ONE_DAY_SECONDS = 60 * 60 * 24;

export async function setAuthToken(token: string) {
    const cookiesStore = await cookies();
    cookiesStore.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // MUST be "lax", not "strict". The social-verification OAuth flow
        // leaves the app entirely (X / Google / etc.) and the provider
        // redirects the browser back to a protected route (/settings). A
        // "strict" cookie is NOT sent on a top-level navigation that
        // originates from another site, so middleware.ts would see no token
        // and bounce the user to /login — an endless connect→login loop.
        // "lax" is sent on top-level GET navigations (exactly the OAuth
        // return) while still blocking CSRF on cross-site subrequests.
        sameSite: 'lax',
        // Share the cookie across apex + www + any subdomain the OAuth flow
        // redirects back to (set COOKIE_DOMAIN=.paza.social in production).
        // Left unset for localhost dev, where a host-only cookie is correct.
        ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
        maxAge: ONE_DAY_SECONDS,
        path: '/',
    })
}

/** Clears the auth cookie using the same attributes it was set with. */
export async function clearAuthToken() {
    const cookiesStore = await cookies();
    cookiesStore.set({
        name: 'token',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
        maxAge: 0,
        path: '/',
    })
}
