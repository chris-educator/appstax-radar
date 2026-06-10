import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { FeedPage } from './pages/FeedPage'
import { ReviewPage } from './pages/ReviewPage'

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
