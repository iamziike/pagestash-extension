import "@/assets/styles/global.css";
import DefaultLayout from "./components/layouts/index.tsx";
import Home from "./components/pages/home.tsx";
import Credentials from "./components/pages/credentials.tsx";
import RecentlyVisitedLinks from "./components/pages/recently-visited.tsx";
import Bookmarks from "./components/pages/bookmarks/index.tsx";
import BookmarkSubFolder from "./components/pages/bookmarks/[id].tsx";
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
      path: `${PAGES.BOOKMARKS.path}/:id`,
      errorElement: <div>Something went wrong</div>,
      element: (
        <DefaultLayout>
          <BookmarkSubFolder />
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
    {
      path: PAGES.RECENTLY_VISITED.path,
      errorElement: <div>Something went wrong</div>,
      element: (
        <DefaultLayout>
          <RecentlyVisitedLinks />
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
