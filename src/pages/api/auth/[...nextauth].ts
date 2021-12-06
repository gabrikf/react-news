import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email repo'",
        },
      },
      //   scope: "read:user",
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      const { email } = user;
      console.log(email);

      await fauna.query(q.Create(q.Collection("users"), { data: { email } }));
      return true;
    },
    // async session({ session }) {
    //   // Send properties to the client, like an access_token from a provider.
    //   console.log(session);
    //   const { user } = session;
    //   console.log(user);
    //   const email = user.email;
    //   await fauna.query(q.Create(q.Collection("users"), { data: { email } }));
    //   return session;
    // },
  },
});
