import { 
    GoogleAuthProvider, 
    signInWithPopup,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
  } from 'firebase/auth';
  import { auth } from '../firebase/firebase';
  
  const API_URL = import.meta.env.VITE_API_URL;
  
  export const authService = {
    async signUpWithLocal(email: string, password: string) {
      try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await response.user.getIdToken();
        return this.authenticateWithProvider(idToken, response.user.displayName, `${API_URL}/register`);
      } catch (error) {
        console.error('Error signing up with local credentials:', error);
        throw error;
      }
    },
    
    async signInWithLocal(email: string, password: string) {
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await response.user.getIdToken();
        return this.authenticateWithProvider(idToken, response.user.displayName, `${API_URL}/login`);
      } catch (error) {
        console.error('Error signing in with local credentials:', error);
        throw error;
      }
    },
    // Sign in with Google
    async signInWithGoogle() {
      try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
          prompt: 'select_account'
        });
        const result = await signInWithPopup(auth, provider);
        
        // Get the ID token
        const idToken = await result.user.getIdToken();
        
        // Send the token to your backend
        return this.authenticateWithProvider(idToken, result.user.displayName, `${API_URL}/google-auth`);
      } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
      }
    },
    
    // Send the Google ID token to your backend
    async authenticateWithProvider(idToken: string, name: string | null, url: string) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({ name }),
        });
        
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
        
        const data = await response.json();
        
        // Store the JWT token from your backend
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          userId: data.userId,
          username: data.username,
          name: data.name
        }));
        
        return data;
      } catch (error) {
        console.error('Error authenticating with backend:', error);
        throw error;
      }
    },

    // Sign out
    async signOut() {
      try {
        await firebaseSignOut(auth);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    },
    
    // Get current user from localStorage
    getCurrentUser() {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    },
    
    // Get JWT token
    getToken() {
      return localStorage.getItem('token');
    },
    
    // Check if user is authenticated
    isAuthenticated() {
      return !!this.getToken();
    }
  };