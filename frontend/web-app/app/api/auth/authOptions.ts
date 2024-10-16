import { NextAuthOptions } from 'next-auth';
import DuendeIdentityServer6 from 'next-auth/providers/duende-identity-server6';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    DuendeIdentityServer6({
      id: 'id-server',
      clientId: 'nextApp',
      clientSecret: process.env.AUTH_SECRET!,
      issuer: process.env.ID_URL,
      authorization: { 
        params: { scope: 'openid profile auctionApp' },
        url: process.env.ID_URL + '/connect/authorize' 
      },
      token:{
        url: `${process.env.ID_URL_INTERNAL}/connect/token`,

      },
      userinfo:{
        url: `${process.env.ID_URL_INTERNAL}/connect/token`,

      },
      idToken: true,
    }),
  ],
  callbacks: {
    async redirect({url,baseUrl}){
      return url.startsWith(baseUrl) ? url : baseUrl
    },
    // async authorized({auth}){
    //   return !!auth
    // },
    async jwt({ token, profile, account }) {
      if (profile) {
        token.username = profile.username;
      }
      if (account) {
        token.access_token = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.username = token.username;
      }
      return session;
    },
  },
};
