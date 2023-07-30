import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        user: { label: "Nome de usuário", type: "text", placeholder: "luanferreira" },
        password: { label: "Senha", type: "password" }
      },

      async authorize({ user, password }, req) {
        console.log({ user, password });

        const res = await fetch(`${process.env.API_URL}/acesso/auth/login`, {
          method: 'POST',
          body: JSON.stringify({ user, password }),
          headers: { "Content-Type": "application/json", "Accept": 'application/json' }
        });

        const userResponse = await res.json();
        console.log(userResponse);

        if (res.ok && userResponse) {
          return userResponse
        } else { return null }
      },

      callbacks: {
        async jwt({ token, user }) {
          return { ...token, ...user };
        },
        async session({ session, token, user }) {
          session.user = token;

          return session;
        },
      }
    })
  ],

  /* session: {
    strategy: 'jwt',
  } */
});