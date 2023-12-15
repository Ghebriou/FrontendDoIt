import { BrowserRouter, Routes, Route, Form } from 'react-router-dom'
import HomePage from "./pages/HomePage.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import NoPage from "./pages/NoPage.jsx";
import Main from "./pages/Main.jsx";
import Mylist from './pages/Mylist.jsx';
import { CookiesProvider } from "react-cookie";
import Prayer from './pages/prayer.jsx';
import Settings from './pages/settings.jsx';
import Scheduled from './pages/scheduled.jsx';
import Dashboard from './pages/dashboard.jsx';


export default function App() {
  return (
    <div>
      <CookiesProvider>
      <BrowserRouter>

      <Routes>
        <Route index element={<HomePage/>} />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/home" element={<Main/>} />
        <Route path="/mylist" element={<Mylist/>} />
        <Route path="/myprayer" element={<Prayer/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/scheduled" element={<Scheduled/>} /> 
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path='*' element={<NoPage/>} />
      </Routes>
      
      </BrowserRouter>
      </CookiesProvider>
    </div>
  )
}
