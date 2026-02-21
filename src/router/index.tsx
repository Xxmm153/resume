import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
const HomeComponent = lazy(() => import("../view/home/home.tsx"));
const NotFoundComponent = lazy(() => import("../view/404/404.tsx"));
const Content = lazy(() => import("../view/content/content.tsx"));
const Edit = lazy(() => import("../view/edit/edit.tsx"));
const TemplateLibrary = lazy(
  () => import("../view/templates/TemplateLibrary.tsx"),
);
const AIConfigPage = lazy(() => import("../view/ai/AIConfig.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <HomeComponent />
      </Suspense>
    ),
  },
  {
    path: "/content",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Content />
      </Suspense>
    ),
    children: [
      {
        path: "templates",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <TemplateLibrary />
          </Suspense>
        ),
      },
      {
        path: "ai-providers",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AIConfigPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/edit/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Edit />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <NotFoundComponent />
      </Suspense>
    ),
  },
]);

export default router;
