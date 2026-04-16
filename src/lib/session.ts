import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionUser = {
  id: string;
  email: string;
  name?: string;
  mustChangePassword: boolean;
};

export type AppSession = IronSession<{
  user?: SessionUser;
}>;

const sessionPassword = process.env.SESSION_SECRET ?? "dev-only-change-in-production-min-32-chars-long!!";
if (process.env.NODE_ENV === "production" && sessionPassword.length < 32) {
  console.error(
    "[session] SESSION_SECRET must be at least 32 characters (iron-session). Set it in Vercel.",
  );
}

const sessionOptions: SessionOptions = {
  password: sessionPassword,
  cookieName: "ftmag_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  },
};

export async function getSession(): Promise<AppSession> {
  return getIronSession<AppSession>(cookies(), sessionOptions);
}
