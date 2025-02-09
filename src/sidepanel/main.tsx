import "@/assets/styles/global.css";
import DefaultLayout from "./components/layouts/index.tsx";
import Home from "./components/pages/home.tsx";
import Credentials from "./components/pages/credentials.tsx";
import Bookmarks from "./components/pages/bookmarks.tsx";
import Settings from "./components/pages/settings.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { PAGES } from "@/constants/index.ts";

export const router = createMemoryRouter(
  [
    {
      path: PAGES.HOME.path,
      errorElement: <div>Something went wrong</div>,
      element: (
        <DefaultLayout>
          <Home />
        </DefaultLayout>
      ),
    },
    {
      path: PAGES.BOOKMARKS.path,
      errorElement: <div>Something went wrong</div>,
      element: (
        <DefaultLayout>
          <Bookmarks />
        </DefaultLayout>
      ),
    },
    {
      path: PAGES.SETTINGS.path,
      errorElement: <div>Something went wrong</div>,
      element: (
        <DefaultLayout>
          <Settings />
        </DefaultLayout>
      ),
    },
    {
      path: PAGES.CREDENTIALS.path,
      errorElement: <div>Something went wrong</div>,
      element: (
        <DefaultLayout>
          <Credentials />
        </DefaultLayout>
      ),
    },
  ],
  {}
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
