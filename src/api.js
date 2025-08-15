const API_URL = "https://edora-server.onrender.com";

// Helper: tokenni olish
function getToken() {
  return localStorage.getItem("token");
}

// Helper: headers
function authHeaders(extra = {}) {
  const token = getToken();
  return {
    ...extra,
    Authorization: token ? `Bearer ${token}` : "",
  };
}

// SUBJECTS
export async function getSubjects() {
  const res = await fetch(`${API_URL}/subjects`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  return data.data; // [ [id, name, tags], ... ]
}

export async function addSubject(subject) {
  const res = await fetch(`${API_URL}/subject`, {
    method: "POST",
    headers: {
      ...authHeaders({ "Content-Type": "application/json" }),
    },
    body: JSON.stringify(subject),
  });
  return res.json();
}

export async function updateSubject(id, subject) {
  const res = await fetch(`${API_URL}/subject/${id}`, {
    method: "PUT",
    headers: {
      ...authHeaders({ "Content-Type": "application/json" }),
    },
    body: JSON.stringify(subject),
  });
  return res.json();
}

export async function deleteSubject(id) {
  const res = await fetch(`${API_URL}/subject/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

// THEMES
export async function getThemes() {
  const res = await fetch(`${API_URL}/themes`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  return data.data; // [ [id, subject_id, title, content, tags], ... ]
}

export async function getThemesBySubject(subjectId) {
  const res = await fetch(`${API_URL}/themes`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  // filter client-side, chunki backendda subject_id query yo‘q
  return (data.data || []).filter((t) => t.subject_id === subjectId);
  // return data
}

export async function addTheme(theme) {
  const res = await fetch(`${API_URL}/theme`, {
    method: "POST",
    headers: {
      ...authHeaders({ "Content-Type": "application/json" }),
    },
    body: JSON.stringify(theme),
  });
  return res.json();
}

export async function updateTheme(id, theme) {
  const res = await fetch(`${API_URL}/theme/${id}`, {
    method: "PUT",
    headers: {
      ...authHeaders({ "Content-Type": "application/json" }),
    },
    body: JSON.stringify(theme),
  });
  return res.json();
}

export async function deleteTheme(id) {
  const res = await fetch(`${API_URL}/theme/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

// AUTH
export async function login(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }),
  });
  if (!res.ok) throw new Error("Login yoki parol noto'g'ri.");
  return res.json();
}

// VIEWS
export async function views(id){
  const res = await fetch(`${API_URL}/views/${id}`,{
    method: "POST"
  })
  return res.json();
}