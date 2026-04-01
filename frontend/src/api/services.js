import api from "./client";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me")
};

export const activityApi = {
  list: (params) => api.get("/activities", { params }),
  create: (payload) => api.post("/activities", payload),
  update: (id, payload) => api.put(`/activities/${id}`, payload),
  remove: (id) => api.delete(`/activities/${id}`)
};

export const dashboardApi = {
  me: () => api.get("/dashboard/me")
};

export const reportApi = {
  monthly: (params) => api.get("/reports/monthly", { params }),
  csvUrl: (params) => {
    const query = new URLSearchParams(params).toString();
    return `${api.defaults.baseURL}/reports/csv?${query}`;
  },
  pdfUrl: (params) => {
    const query = new URLSearchParams(params).toString();
    return `${api.defaults.baseURL}/reports/pdf?${query}`;
  }
};

export const adminApi = {
  users: () => api.get("/admin/users"),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  stats: () => api.get("/admin/stats"),
  factors: () => api.get("/admin/factors"),
  updateFactor: (payload) => api.put("/admin/factors", payload)
};
