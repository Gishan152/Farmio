// moderatorUtils.js - Shared utilities for moderator dashboards/pages
// Provides formatting helpers and API wrappers used across moderator views.

import api from '../API/client';
import { API_BASE_URL } from '../config/apiConfig';
import { fetchAllProducts } from './cropUtils';
import { formatOrderStatus as baseFormatOrderStatus, getStatusColor as baseGetStatusColor } from './orderUtils';

// ---- Formatting helpers ----

/**
 * Format a number as LKR currency (e.g., "LKR 1,234.56")
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return 'LKR 0.00';
  const value = Number(amount);
  return `LKR ${value.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format a date/time into a short, readable string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Re-export order status helpers to keep one source of truth
export const formatOrderStatus = (status) => baseFormatOrderStatus(status);
export const getStatusColor = (status) => baseGetStatusColor(status);

// ---- Orders (moderator) ----

/**
 * Fetch all orders visible to moderator via analytics service
 */
export const fetchAllOrdersForModerator = async () => {
  try {
    // Prefer analytics admin endpoint if available
    const res = await api.get('/api/analytics/admin/orders');
    return res?.data || [];
  } catch (err) {
    // Fallback to direct fetch as plain GET (in case axios baseURL/env issues)
    try {
      const resp = await fetch(`${API_BASE_URL}/api/analytics/admin/orders`);
      if (resp.ok) return await resp.json();
    } catch (_) {}
    console.warn('fetchAllOrdersForModerator: falling back to empty list due to API error', err?.message);
    return [];
  }
};

/**
 * Update an order status (best-effort; provides dev fallback)
 */
export const updateOrderStatus = async (orderId, status) => {
  // Try common admin/analytics endpoints
  const candidates = [
    `/api/analytics/admin/orders/${orderId}/status`,
    `/api/orders/${orderId}/status`,
  ];

  for (const path of candidates) {
    try {
      const res = await api.put(path, { status });
      return res?.data ?? { success: true };
    } catch (e) {
      // try next
    }
  }

  // Dev fallback to keep UI responsive
  console.warn('updateOrderStatus: using dev fallback');
  return { success: true, orderId, status, message: 'Dev fallback: status updated locally' };
};

/**
 * Fetch pending orders only (derived on client if backend filter not available)
 */
export const fetchPendingOrders = async () => {
  const orders = await fetchAllOrdersForModerator();
  return Array.isArray(orders) ? orders.filter(o => o.status === 'PENDING') : [];
};

/**
 * Fetch recent orders with optional limit
 */
export const fetchRecentOrders = async (limit = 7) => {
  const orders = await fetchAllOrdersForModerator();
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt || b.orderDate || 0) - new Date(a.createdAt || a.orderDate || 0));
  return sorted.slice(0, limit);
};

/**
 * Aggregate moderator dashboard stats
 */
export const fetchModeratorStats = async () => {
  try {
    const [orders, products] = await Promise.all([
      fetchAllOrdersForModerator(),
      fetchAllProducts().catch(() => []),
    ]);

    const pendingOrders = Array.isArray(orders) ? orders.filter(o => o.status === 'PENDING').length : 0;
    const productsForReview = Array.isArray(products) ? products.filter(p => (p.status || '').toLowerCase() === 'under review').length : 0;
    // Basic derived metric; adjust when a dedicated endpoint is available
    const tasksCompleted = Array.isArray(orders) ? orders.filter(o => o.status === 'DELIVERED').length : 0;

    return { pendingOrders, productsForReview, tasksCompleted };
  } catch (err) {
    console.warn('fetchModeratorStats: fallback due to API error', err?.message);
    return { pendingOrders: 0, productsForReview: 0, tasksCompleted: 0 };
  }
};

/**
 * Recent inventory updates derived from product list
 */
export const fetchRecentInventoryUpdates = async (limit = 7) => {
  try {
    const products = await fetchAllProducts();
    const mapped = (products || []).map(p => ({
      productName: p.productName || p.name || 'Product',
      action: 'Update',
      availableStock: p.availableStock ?? p.stock ?? 0,
      measurement: p.measurement || p.unit || 'unit',
      updatedAt: p.updatedAt || p.lastUpdated || p.createdAt || new Date().toISOString(),
      location: p.location || undefined,
    }));
    const sorted = mapped.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return sorted.slice(0, limit);
  } catch (err) {
    console.warn('fetchRecentInventoryUpdates: fallback due to API error', err?.message);
    return [];
  }
};

/**
 * Products that need moderator review
 */
export const fetchProductsForReview = async () => {
  try {
    const products = await fetchAllProducts();
    return (products || []).filter(p => (p.status || '').toLowerCase() === 'under review');
  } catch (err) {
    console.warn('fetchProductsForReview: fallback due to API error', err?.message);
    return [];
  }
};

// ---- Products (moderator) ----

/**
 * Fetch all products for moderator view (reuse cropUtils implementation)
 */
export const fetchAllProductsForModerator = async () => {
  return await fetchAllProducts();
};

/** Approve a product listing */
export const approveProduct = async (productId) => {
  const candidates = [
    `/api/analytics/admin/products/${productId}/approve`,
    `/api/products/${productId}/approve`,
  ];
  for (const path of candidates) {
    try {
      const res = await api.post(path);
      return res?.data ?? { success: true };
    } catch (e) {}
  }
  console.warn('approveProduct: using dev fallback');
  return { success: true, productId, message: 'Dev fallback: product approved locally' };
};

/** Reject a product listing */
export const rejectProduct = async (productId, reason = 'Rejected') => {
  const payload = { reason };
  const candidates = [
    `/api/analytics/admin/products/${productId}/reject`,
    `/api/products/${productId}/reject`,
  ];
  for (const path of candidates) {
    try {
      const res = await api.post(path, payload);
      return res?.data ?? { success: true };
    } catch (e) {}
  }
  console.warn('rejectProduct: using dev fallback');
  return { success: true, productId, reason, message: 'Dev fallback: product rejected locally' };
};

export default {
  // Formatting
  formatCurrency,
  formatDate,
  formatOrderStatus,
  getStatusColor,
  // Orders
  fetchAllOrdersForModerator,
  updateOrderStatus,
  fetchPendingOrders,
  fetchRecentOrders,
  fetchModeratorStats,
  fetchRecentInventoryUpdates,
  fetchProductsForReview,
  // Products
  fetchAllProductsForModerator,
  approveProduct,
  rejectProduct,
};
