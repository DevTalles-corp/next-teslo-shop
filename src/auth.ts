'use server';


import NextAuth from "next-auth";
import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import prisma from "./lib/prisma";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        if( !bcrypt.compareSync(password, user.password) ) return null;

        return user;
      },
    }),
  ],
});
