export const API = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`;

export const authHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {};
  }

  return {
    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };
};