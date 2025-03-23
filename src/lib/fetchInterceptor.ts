// src/lib/fetchInterceptor.ts (frontend)
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  // Obtener token
  const token = localStorage.getItem("auth_token");

  // Configurar headers
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  // Añadir token si existe
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Ejecutar fetch
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Manejar respuesta 401 (no autorizado)
  if (response.status === 401) {
    // Intentar refrescar token o redireccionar a login
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  return response;
};
