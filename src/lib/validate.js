export function isNonEmptyString(v, max = 500) {
  return typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;
}

export function isValidPhone(v) {
  if (typeof v !== 'string') return false;
  const cleaned = v.replace(/[\s-]/g, '');
  return /^(\+?\d{7,15})$/.test(cleaned);
}

export function isValidEmail(v) {
  if (!v) return true; // email optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function sanitizeText(v, max = 2000) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

/**
 * Validates a checkout payload of shape:
 * { customerName, phone, email, address, notes, items: [{productId, qty}] }
 */
export function validateCheckoutPayload(body) {
  const errors = {};
  if (!isNonEmptyString(body?.customerName, 120)) errors.customerName = 'Full name is required.';
  if (!isValidPhone(body?.phone)) errors.phone = 'Enter a valid phone number.';
  if (!isValidEmail(body?.email)) errors.email = 'Enter a valid email address.';
  if (!isNonEmptyString(body?.address, 500)) errors.address = 'Delivery address is required.';
  if (!Array.isArray(body?.items) || body.items.length === 0) {
    errors.items = 'Your cart is empty.';
  } else {
    for (const it of body.items) {
      if (!it.productId || !Number.isFinite(Number(it.qty)) || Number(it.qty) < 1) {
        errors.items = 'Invalid cart item.';
        break;
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateProductPayload(body) {
  const errors = {};
  if (!isNonEmptyString(body?.name, 150)) errors.name = 'Product name is required.';
  if (!isNonEmptyString(body?.description, 4000)) errors.description = 'Description is required.';
  if (!isNonEmptyString(body?.size, 30)) errors.size = 'Size is required.';
  if (!Number.isFinite(Number(body?.price)) || Number(body.price) < 0) {
    errors.price = 'Price must be a valid positive number.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
