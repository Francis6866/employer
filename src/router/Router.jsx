import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/layout/AppLayout";
import JobListing from "@/pages/JobListing";
import JobPage from "@/pages/JobPage";
import LandingPage from "@/pages/LandingPage";
import MyJobs from "@/pages/MyJobs";
import Onboarding from "@/pages/Onboarding";
import PostJobs from "@/pages/PostJobs";
import SavedJobs from "@/pages/SavedJobs";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path:"/",
          element: <LandingPage />
        },
        {
          path:"/onboarding",
          element: (
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          )
        },
        {
          path:"/jobs",
          element:  (
            <ProtectedRoute>
              <JobListing />
            </ProtectedRoute>
          )
        },
        {
          path:"/jobs/:id",
          element:  (
            <ProtectedRoute>
              <JobPage />
            </ProtectedRoute>
          )
        },
        {
          path:"/post-job",
          element:   (
            <ProtectedRoute>
              <PostJobs />
            </ProtectedRoute>
          )
        },
        {
          path:"/saved-job",
          element:   (
            <ProtectedRoute>
              <SavedJobs />
            </ProtectedRoute>
          )  
        },
        {
          path:"/my-job",
          element:   (
            <ProtectedRoute>
              <MyJobs />
            </ProtectedRoute>
          )
        },
      ]
    },
  ])

  export default router