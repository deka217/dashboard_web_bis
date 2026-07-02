const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(options.headers || {})
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...options
  });

  if (!response.ok) {
    let message = "Request failed.";
    try {
      const data = await response.json();
      message = data.message || data.details || message;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }
  return response.json();
}

export const api = {
  users: {
    list: () => request("/users")
  },
  categories: {
    list: () => request("/categories"),
    create: (payload) => request("/categories", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) =>
      request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id) => request(`/categories/${id}`, { method: "DELETE" })
  },
  brands: {
    list: () => request("/brands"),
    create: (payload) => request("/brands", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) =>
      request(`/brands/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id) => request(`/brands/${id}`, { method: "DELETE" })
  },
  products: {
    list: () => request("/products"),
    create: (payload) => request("/products", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) =>
      request(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id) => request(`/products/${id}`, { method: "DELETE" })
  },
  productImages: {
    list: () => request("/product-images"),
    create: (payload) =>
      request("/product-images", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) =>
      request(`/product-images/${id}`, { method: "PUT", body: JSON.stringify(payload) })
  },
  productDetails: {
    list: (productID) =>
      request(productID ? `/product-details?productID=${productID}` : "/product-details"),
    create: (payload) =>
      request("/product-details", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) =>
      request(`/product-details/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id) => request(`/product-details/${id}`, { method: "DELETE" })
  },
  uploads: {
    uploadProductImage: (file) => {
      const formData = new FormData();
      formData.append("image", file);
      return request("/uploads/product-image", { method: "POST", body: formData });
    },
    uploadBrandImage: (file) => {
      const formData = new FormData();
      formData.append("image", file);
      return request("/uploads/brand-image", { method: "POST", body: formData });
    }
  },
  messages: {
    list: () => request("/messages"),
    update: (id, payload) => request(`/messages/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id) => request(`/messages/${id}`, { method: "DELETE" })
  },
  reviews: {
    list: () => request("/product-reviews")
  }
};

export { API_BASE_URL };
