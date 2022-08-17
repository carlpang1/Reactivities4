import { ActivityFormValues } from "./../models/activity";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { Activity } from "../models/activity";
import { User, UserFormValues } from "../models/user";
import { store } from "../stores/store";
import { Photo, Profile } from "../models/profile";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token) config.headers!.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
    // try {
    //   await sleep(1000);
    //   return response;
    // } catch (error) {
    //   console.log(error);
    //   return await Promise.reject(error);
    // }
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response!;
    switch (status) {
      case 400:
        if (typeof data === "string") {
          toast.error(data);
        }
        if (config.method === "get" && data.errors.hasOwnProperty("id")) {
          history.push("/not-found");
        }
        if (data.errors) {
          const modalStateError = [];
          for (const key in data.errors) {
            if (data.errors[key]) modalStateError.push(data.errors[key]);
          }
          throw modalStateError.flat();
        } else {
          toast.error(data);
        }
        break;
      case 401:
        toast.error("unauthorised");
        break;
      case 404:
        history.push("/not-found");
        break;
      case 500:
        store.commonStore.setServerError(data);
        history.push("/server-error");
        break;
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const request = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: () => request.get<Activity[]>("/activities"),
  detail: (id: string) => request.get<Activity>(`/activities/${id}`),
  create: (activity: ActivityFormValues) =>
    request.post<void>("/activities", activity),
  update: (activity: ActivityFormValues) =>
    request.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => request.delete<void>(`/activities/${id}`),
  attend: (id: string) => request.post<void>(`/activities/${id}/attend`, {}),
};

const Account = {
  current: () => request.get<User>("/account"),
  login: (user: UserFormValues) => request.post<User>("/account/login", user),
  register: (user: UserFormValues) =>
    request.post<User>("/account/register", user),
};

const Profiles = {
  get: (username: string) => request.get<Profile>(`/profiles/${username}`),
  uploadPhoto: (file: Blob) => {
    let formData = new FormData();
    formData.append("File", file);
    return axios.post<Photo>("photos", formData, {
      headers: { "Content-type": "multipart/form-data" },
    });
  },
  setMainPhoto: (id: string) => request.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => request.delete(`/photos/${id}`),
  updateProfile: (profile: Partial<Profile>) =>
    request.put("/profiles", profile),
  updateFollowing: (username: string) =>
    request.post(`/follows/${username}`, {}),
  listFollowings: (username: string, predicate: string) =>
    request.get<Profile[]>(`/follows/${username}?predicate=${predicate}`),
};

const agent = {
  Activities,
  Account,
  Profiles,
};

export default agent;
