import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { cookies, headers } from 'next/headers';
import { NextRequest } from 'next/server'; // Update this to NextRequest
import { authOptions } from "../api/auth/authOptions";

export async function getSession() {
    return await getServerSession(authOptions);
}

export async function getCurrentUser() {
    try {
        const session = await getSession();

        if (!session) return null;

        return session.user;

    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getTokenWorkaround() {
    const req = {
        headers: Object.fromEntries(headers() as Headers),
        cookies: Object.fromEntries(
            cookies()
                .getAll()
                .map(c => [c.name, c.value])
        )
    } as unknown as NextRequest; // Change to NextRequest

    return await getToken({ req });
}
