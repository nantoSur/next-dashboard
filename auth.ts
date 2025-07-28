import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt"; // bcryptjs juga bisa, asal konsisten dengan yang dipakai saat insert
import postgres from "postgres";

// Koneksi ke Supabase PostgreSQL
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Fungsi ambil user berdasarkan email
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`
      SELECT * FROM users WHERE email = ${email}
    `;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

// Export Auth handler
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig, // pastikan auth.config.ts sudah benar
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsed.success) {
          console.log("Invalid credentials format");
          return null;
        }

        const { email, password } = parsed.data;

        const user = await getUser(email);
        if (!user) {
          console.log("User not found:", email);
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          console.log("Password mismatch for:", email);
          return null;
        }

        // Kembalikan data user (tanpa password)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
});
