import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "../pages/Layout"
import { Home } from "../pages/Home"
import { ShowDetail } from "../pages/ShowDetail"
import {SeasonDetail } from "../pages/SeasonDetail"
import { EpisodeDetail } from "../pages/EpisodeDetail"
import { Favourites } from "../pages/Favourites"
import { GenreFilter } from "../pages/GenreFilter"
import { Reset } from "../components/Reset"
import { AudioPlayer } from "../components/AudioPlayer"

function App() {
 return (
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="podcast" element={<ShowDetail />} />
          <Route path="season" element={<SeasonDetail />} />
          <Route path="episode" element={<EpisodeDetail />} />
          <Route path="favourites" element={<Favourites />} />
          <Route path="filter" element={<GenreFilter />} />
        </Route>
      </Routes>
    </BrowserRouter>
 )
}

export default App
