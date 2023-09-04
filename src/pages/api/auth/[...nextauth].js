import chalk from 'chalk';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authHandler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Basic Auth',
      type: 'credentials',

      credentials: {
        user: { label: "Nome de usuário", type: "text", placeholder: "luanferreira" },
        password: { label: "Senha", type: "password" }
      },

      async authorize({ user, password }, req) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          body: JSON.stringify({ user, password }),
          headers: { "Content-Type": "application/json", "Accept": 'application/json' }
        });

        const userResponse = await res.json();

        if (res.ok && userResponse) {
          return userResponse;
        }
        else {
          return null;
        }
      },
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...user, ...token };
    },
    async session({ session, token }) {
      session.user = token.usuario;
      session.token = token.token;
      return session;
    },
  }
});

export default async function handler(...params) {
  await authHandler(...params);
}