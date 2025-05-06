import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  // Restrict sign-in to UMBC Google accounts
  hd: "umbc.edu",
});
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');

export const handleGoogleSignIn = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithPopup(auth, provider);
  
      const user = result.user;
      const email = user.email;
      if (!email || !email.endsWith("@umbc.edu")) { //signs them out if they are not a UMBC account
        await auth.signOut();
        throw new Error("Access denied. You must use a UMBC account.");
      }
  
      console.log("User signed in with UMBC account:", email);
  
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  