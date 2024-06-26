import instance from "./index";

export function register(inputs) {
  return instance.post("/api/auth/register", { ...inputs });
}

export function saveBusinessAPI(
  userId,
  name,
  phone,
  idCardR,
  idCardL,
  isPass = 1
) {
  return instance.post("/api/business/save", {
    userId,
    name,
    phone,
    idCardR,
    idCardL,
    isPass,
  });
}

export function login(inputs) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        instance.post(
          "/api/auth/login",
          { ...inputs },
          {
            withCredentials: true,
          }
        )
      );
    }, 1000);
  });
}
export function isBusiness() {
  return instance.post(
    "/api/business/check"
    // {},
    // {
    //   withCredentials: true,
    // }
  );
}
export function logout() {
  return instance.post("/api/auth/logout");
}

export function online() {
  return instance.post("/api/user/markline");
}

export function offline() {
  return instance.delete("/api/user/markline");
}

export function upload(formData) {
  return instance.post("/api/applet/upload", formData);
}

export function signinAPI(userId) {
  return instance.post(`/api/integarl/signin?userId=${userId}`);
}

export function browseinAPI() {
  return instance.post("/api/integarl/browsein");
}
export function search(query) {
  return instance.get("/api/search", {
    params: {
      query,
    },
  });
}

export function getRecommendUsers() {
  return instance.get("/api/home/user", {
    params: {
      count: 3,
    },
  });
}

export function getLatest() {
  return instance.get("/api/home/post");
}

export function getOnline() {
  return instance.get("/api/home/online");
}

export function getNotifications() {
  return instance.get("/api/chat/getlist");
}

export function getAllCount() {
  return instance.get("/api/chat/count");
}

export function getUserRank() {
  return instance.get("/api/statistics/hotUser");
}

export function getPostRank() {
  return instance.get("/api/statistics/hotPost");
}
