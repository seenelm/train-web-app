import { 
    GoogleAuthProvider, 
    signInWithPopup,
    signOut as firebaseSignOut,
  } from 'firebase/auth';
  import { auth } from '../firebase/firebase';
  import api from './apiClient';
  import { UserRequest, UserLoginRequest } from '@seenelm/train-core';
  import { tokenService } from './tokenService';
  
  const API_URL = import.meta.env.VITE_API_URL;
  
  export const authService = {
    async register(userRequest: UserRequest) {
      try {
        const response = await api.post(`${API_URL}/user/register`, userRequest);
        tokenService.setTokens(response.data.token, response.data.refreshToken);
        return response.data;
      } catch (error) {
        console.error('Error registering user:', error);
        throw error;
      }
    },

    async login(userLoginRequest: UserLoginRequest) {
      try {
        const response = await api.post(`${API_URL}/user/login`, userLoginRequest);
        tokenService.setTokens(response.data.token, response.data.refreshToken);
        return response.data;
      } catch (error) {
        console.error('Error logging in user:', error);
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
        
        // Send the token to your backend with device ID
        const response = await api.post(`${API_URL}/user/google-auth`, {
          name: result.user.displayName,
          deviceId: tokenService.getDeviceId()
        }, {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        });
        
        // Store tokens using tokenService
        tokenService.setTokens(response.data.token, response.data.refreshToken);
        
        // Store user data
        localStorage.setItem('user', JSON.stringify({
          userId: response.data.userId,
          username: response.data.username,
          name: response.data.name
        }));
        
        return response.data;
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
        // Call the signout endpoint first
        if (this.isAuthenticated()) {
          try {
            await api.post(`${API_URL}/user/logout`);
          } catch (signoutError) {
            console.error('Error calling signout endpoint:', signoutError);
            // Continue with local signout even if the API call fails
          }
        }
        
        await firebaseSignOut(auth);
        // Clear old tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Clear access and refresh tokens
        tokenService.clearTokens();
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
      return tokenService.getAccessToken();
    },
    
    // Check if user is authenticated
    isAuthenticated() {
      return !!this.getToken();
    }
  };