import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');

export const handleGoogleSignIn = async () => {
    try {
        await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithPopup(auth, provider);
  
      const user = result.user;
      //console.log('User signed in:', user);
  
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  