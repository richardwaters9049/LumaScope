// lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to get the auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

// Helper function to set the auth token
const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

// Helper function to remove auth tokens
const clearAuthTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// Wrapper around fetch that handles authentication
const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Get the auth token
  const token = getAuthToken();
  
  // Set up headers
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Make the request
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If unauthorized, try to refresh the token
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      try {
        // Try to refresh the token
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        });

        if (refreshResponse.ok) {
          const { access_token } = await refreshResponse.json();
          
          // Update the stored token
          setAuthToken(access_token);
          
          // Retry the original request with the new token
          headers.set('Authorization', `Bearer ${access_token}`);
          return fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
          });
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
      
      // If we get here, refresh failed - clear tokens and redirect to login
      clearAuthTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else {
      // No refresh token, redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    throw new Error('Authentication required');
  }
  
  return response;
};

// Upload an image
interface UploadResponse {
  filename: string;
  url: string;
  // Add other fields as needed
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiFetch('/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Upload failed');
  }
  
  return response.json();
}

// Example of a typed API call
export async function getAnalysis(analysisId: string) {
  const response = await apiFetch(`/analysis/${analysisId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch analysis');
  }
  return response.json();
}

// Example of a POST request
export async function createAnalysis(data: any) {
  const response = await apiFetch('/analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to create analysis');
  }
  
  return response.json();
}

// Export the main fetch function for custom requests
export { apiFetch as fetch };
