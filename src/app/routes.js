import Page from './pages/page'
import Admin from './pages/admin'
import NotFound from './pages/not_found'

export default {
  '/page': Page,
  '/admin': Admin,
  '*': NotFound
}
