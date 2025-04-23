import { 
    GoogleAuthProvider, 
    signInWithPopup,
    signOut as firebaseSignOut
  } from 'firebase/auth';
  import { auth } from '../firebase/firebase';
  
  const API_URL = import.meta.env.VITE_API_URL;
  
  export const authService = {
    // Sign in with Google
    async signInWithGoogle() {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        
        // Get the ID token
        const idToken = await result.user.getIdToken();
        
        // Send the token to your backend
        return this.authenticateWithGoogle(idToken, result.user.displayName);
      } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
      }
    },
    
    // Send the Google ID token to your backend
    async authenticateWithGoogle(idToken: string, name: string | null) {
      try {
        const response = await fetch(`${API_URL}/google-auth`, {
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