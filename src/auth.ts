import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
    authorization: {
        params: {
          prompt: "select_account"
        },
      },
  })],

  callbacks: {
    signIn : async ({ user }) => {
      try {
          const raw = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-user`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(user),
          })
          const response = await raw.json();
          return response.success ? true : false;
      } catch (error) {
          console.error("error in signIn ", error);
          return false;
      }
      },
  }
    
})