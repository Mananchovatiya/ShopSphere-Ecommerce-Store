// utils/format.js - Small formatting helpers

export const formatPrice = (amount) => {
  const n = Number(amount) || 0;
  return `₹${n.toLocaleString("en-IN")}`;
};

// Alias for admin dashboard components
export const formatCurrency = formatPrice;