import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/AdminLayout'
import { Layout } from './components/Layout'
import { RequireAuth } from './components/RequireAuth'
import { StudentWorkPage } from './pages/StudentWorkPage'
import { AdminHomePage } from './pages/admin/AdminHomePage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminPostsPage } from './pages/admin/AdminPostsPage'
import { AdminProfilePage } from './pages/admin/AdminProfilePage'
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage'
import { AdminResumePage } from './pages/admin/AdminResumePage'
import { AdminStudentWorkPage } from './pages/admin/AdminStudentWorkPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PostDetailPage } from './pages/PostDetailPage'
import { PostListPage } from './pages/PostListPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ResumePage } from './pages/ResumePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:slug" element={<ProjectDetailPage />} />
          <Route path="blog" element={<PostListPage type="blog" />} />
          <Route path="blog/:slug" element={<PostDetailPage type="blog" />} />
          <Route path="student-work" element={<StudentWorkPage />} />
          <Route path="notes" element={<PostListPage type="note" />} />
          <Route path="notes/:slug" element={<PostDetailPage type="note" />} />
          <Route path="about" element={<Navigate to="/projects" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin" element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminHomePage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="posts" element={<AdminPostsPage />} />
            <Route path="resume" element={<AdminResumePage />} />
            <Route path="student-work" element={<AdminStudentWorkPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
