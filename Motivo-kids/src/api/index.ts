// src/api.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ================== QUEUE FOR TOKEN REFRESH ==================
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// ================== REQUEST INTERCEPTOR ==================
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (config.headers && token) {
    const skipAuthUrls = ['/auth/signup', '/auth/login', '/auth/verify-otp', '/auth/token/refresh/'];
    if (!skipAuthUrls.some(url => config.url?.includes(url))) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ================== RESPONSE INTERCEPTOR ==================
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } }) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const refreshToken = localStorage.getItem('refresh_token');

    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await api.post('/auth/token/refresh/', { refresh: refreshToken });
        const newAccess = res.data.access;
        localStorage.setItem('access_token', newAccess);
        processQueue(null, newAccess);

        if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ================== AUTH ==================
export const signupRequest = async (data: { firstName: string; lastName: string; email: string }) => {
  const res = await api.post('/auth/signup/', {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
  });
  return res.data;
};

export const loginRequest = async (email: string) => {
  const res = await api.post('/auth/login/', { email });
  if (res.data.access) localStorage.setItem('access_token', res.data.access);
  if (res.data.refresh) localStorage.setItem('refresh_token', res.data.refresh);
  return res.data;
};

export const verifyOtpRequest = async (email: string, otp: string) => {
  const res = await api.post('/auth/verify-otp/', { email, otp });
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

// ================== USER PROFILE ==================
export const fetchCurrentUserProfile = async (): Promise<any | null> => {
  try {
    const res = await api.get('/profile/');
    if (Array.isArray(res.data)) return res.data.length > 0 ? res.data[0] : null;
    return res.data;
  } catch (err) {
    console.error('Failed to fetch user profile:', (err as AxiosError).message);
    return null;
  }
};

export const updateUserProfile = async (id: number, data: any, profileImage?: File) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => formData.append(key, data[key]));
  if (profileImage) formData.append('profile_image', profileImage);

  const res = await api.patch(`/profile/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// ================== PRODUCTS ==================
export const fetchProductsByCategory = async (categorySlug?: string): Promise<any[]> => {
  const res = await api.get('/products/', { params: categorySlug ? { category: categorySlug } : {} });
  return Array.isArray(res.data) ? res.data : [];
};
export const fetchFeaturedProducts = async (): Promise<any[]> => fetchProductsByCategory();
export const fetchAllProducts = async (): Promise<any[]> => fetchProductsByCategory();

// ================== CART ==================
export const fetchCart = async () => (await api.get('/cart/')).data;
export const addToCart = async (productId: number, quantity = 1) =>
  (await api.post('/cart/', { product_id: Number(productId), quantity: Number(quantity) })).data;
export const removeFromCart = async (cartItemId: number) =>
  (await api.delete(`/cart/${cartItemId}/`)).data;
export const updateCart = async (cartItemId: number, quantity: number) =>
  (await api.put(`/cart/${cartItemId}/`, { quantity: Number(quantity) })).data;

// ================== WISHLIST ==================
export const fetchWishlist = async (): Promise<any[]> => {
  try {
    const res = await api.get('/wishlist/');
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('Failed to fetch wishlist:', (err as AxiosError).message);
    return [];
  }
};

export const addToWishlist = async (productId: number): Promise<any> =>
  (await api.post('/wishlist/', { product_id: productId })).data;
export const removeFromWishlist = async (wishlistItemId: number): Promise<boolean> => {
  await api.delete(`/wishlist/${wishlistItemId}/`);
  return true;
};

// ================== ORDERS ==================
export const fetchOrders = async (): Promise<any[]> => {
  try {
    const res = await api.get('/orders/');
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('Failed to fetch orders:', (err as AxiosError).message);
    return [];
  }
};

export interface OrderItemPayload {
  product: number;
  quantity: number;
}

export const createOrder = async (items: OrderItemPayload[]): Promise<any> =>
  (await api.post('/orders/', { items })).data;

export const markOrderPaid = async (orderId: number, method: string, transactionId?: string): Promise<any> =>
  (await api.post(`/orders/${orderId}/mark_paid/`, { method, transaction_id: transactionId || null })).data;
// ================== SELLER AUTH ==================
// src/api.ts
export const fetchCategories = async (): Promise<any[]> => {
  const res = await api.get('/categories/');
  return Array.isArray(res.data) ? res.data : [];
};
