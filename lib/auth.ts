import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from './mongodb';
import Patient from './models/Patient';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      
      // Fetch user role from database
      if (token.email) {
        try {
          await connectDB();
          const patient = await Patient.findOne({ userId: token.email });
          if (patient) {
            token.role = patient.role;
            token.hasCompletedInfo = patient.hasCompletedInfo;
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.role = token.role;
      session.hasCompletedInfo = token.hasCompletedInfo;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If signing in, redirect to role selection first
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/select-role`;
      }
      return `${baseUrl}/select-role`;
    },
  },
  pages: {
    signIn: "/login",
  },
};
