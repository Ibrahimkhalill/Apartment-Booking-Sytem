import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";


const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: "include",
    prepareHeaders : (headers)=>{
      const authToken = Cookies.get("a-token");
      if (authToken) {
        headers.set("Authorization", `Token ${authToken}`);
      }
    },
  }),
  endpoints: (builder) => ({
    checkAuth: builder.query({
      query: () => "/api/check-auth/",
    }),
  }),
});

export const { useCheckAuthQuery } = apiSlice;
export default apiSlice;
