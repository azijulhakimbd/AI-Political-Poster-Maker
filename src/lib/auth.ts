import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { API_URL } from "@/lib/api-url";

type AuthUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
  avatar?: string;
  accessToken?: string;
};

type AuthToken = JWT & {
  id?: string;
  role?: string;
  avatar?: string;
  accessToken?: string;
};

export const authConfig: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            cache: "no-store",
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (!data.success || !data.user) {
            return null;
          }

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            avatar: data.user.avatar,
            accessToken: data.token,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      const authToken = token as AuthToken;
      const authUser = user as AuthUser | undefined;

      if (authUser) {
        authToken.id = authUser.id;
        authToken.role = authUser.role;
        authToken.avatar = authUser.avatar;
        authToken.accessToken = authUser.accessToken;
      }

      return authToken;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      const authToken = token as AuthToken;

      if (session.user) {
        session.user.id = authToken.id ?? "";
        session.user.role = authToken.role;
        session.user.avatar = authToken.avatar;
      }

      session.accessToken = authToken.accessToken ?? "";

      return session;
    },
  },
};