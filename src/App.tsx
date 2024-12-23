import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "../pages/Layout"
import { Home } from "../pages/Home"
import {SeasonDetail } from "../pages/SeasonDetail"
import { Favourites } from "../pages/Favourites"
import  NotFound  from "../pages/NotFound"
// import { Reset } from "../components/Reset"


function App() {
 return (
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="season/:id" element={<SeasonDetail />} />
          <Route path="favourites" element={<Favourites />} />
          <Route path="*" element={<NotFound/>} />
        </Route>
      </Routes>
    </BrowserRouter>
 )
}

export default App
