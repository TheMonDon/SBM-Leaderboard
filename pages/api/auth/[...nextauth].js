import NextAuth from "next-auth";
import Users from "../../../database/Users";
import DiscordProvider from "next-auth/providers/discord";
import * as DiscordOauth2 from "discord-oauth2";

const oauth = new DiscordOauth2({
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
});

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identify connections",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, profile, account }) {
      if (profile) {
        token.id = profile.id;
        token.discriminator = profile.discriminator;
        token.locale = profile.locale;
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      if (!session?.user) return session;
      session.user.id = token.id;
      session.user.tag = token.discriminator;
      session.user.locale = token.locale;

      const connections = await oauth.getUserConnections(token.accessToken);
      session.user.steamId = connections.find((c) => c.type === "steam")?.id;
      session.user.steamName = connections.find(
        (c) => c.type === "steam"
      )?.name;

      await Users.upsert({
        discord_id: session.user.id,
        discord_name: session.user.name,
        discord_tag: session.user.tag,
        discord_profile_picture: session.user.image,
        last_login: new Date().toISOString(),
      });

      return session;
    },
  },
  events: {
    async signIn({ user, account, profile, email, credentials }) {},
  },
});
