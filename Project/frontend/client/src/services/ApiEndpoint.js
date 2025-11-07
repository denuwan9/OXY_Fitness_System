import axios from "axios";


const instance = axios.create({
  baseURL: "http://localhost:6017", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true // This is important for cookies
});



export const get = (url, params) => instance.get(url, { params });
export const post = (url, data) => instance.post(url, data);
export const put = (url, data) => instance.put(url, data);
export const deleteUser = (url) => instance.delete(url);
export const updateUser = (url) => instance.updateUser(url);



instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  console.log('intercpert reponse',response)
  return response;
}, function (error) {
  console.log('intercpert reponse',error)
  return Promise.reject(error);
});

// Add request interceptor to include token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//  changePassword function

export const changePassword = async (currentPassword, newPassword, token) => {
  const res = await axios.post(
    'http://localhost:6017/api/auth/change-password',
    { currentPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};