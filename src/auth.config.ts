import type { NextAuthConfig } from "next-auth";

const protectedRoutes = [
  "/checkout/address",
  "/checkout",
  "/orders",
  "/orders/[id]",
];

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    

    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuthenticatedRoute = protectedRoutes.includes(
        request.nextUrl.pathname
      );

      console.log({
        isLoggedIn
      });
      // console.log({isLoggedIn, user: auth?.user});

      if (isOnAuthenticatedRoute) {
        if (isLoggedIn) return true;

        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }

      return true;
    },



    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      if ( session.user ) {
        (session.user as any).role = 'admin';
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      return token;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
