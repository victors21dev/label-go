import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const checkUser = async () => {
  // Use `auth()` to access `isAuthenticated` - if false, the user is not signed in
  const { isAuthenticated } = await auth();
  console.log(isAuthenticated);
};

export default checkUser;
