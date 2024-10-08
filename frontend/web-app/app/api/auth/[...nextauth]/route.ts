import NextAuth, { NextAuthOptions } from "next-auth"
import DuendeIdentityServer6 from 'next-auth/providers/duende-identity-server6';

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        DuendeIdentityServer6({
            id: 'id-server',
            clientId: 'nextApp',
            clientSecret: process.env.NEXTAUTH_SECRET!,
            issuer: process.env.ID_URL,
            authorization: {params: {scope: 'openid profile auctionApp'}},
            idToken: true
        })
    ],
    callbacks: {
        async jwt({token, profile, account}) {
            if (profile) {
                token.username = profile.username
            }
            if (account) {
                token.access_token = account.access_token
            }
            // console.log({token, profile, account})
            return token;
        },
        async session({session, token}) {
            if (token) {
                session.user.username = token.username;
                // session.accessToken   = token.access_token;
            }
            return session;
        }
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }