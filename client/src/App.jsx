import {Routes, Route} from 'react-router-dom'
import {MapProvider} from 'react-map-gl/maplibre'

import MapPage from './Map'



const App = () => {

  return (
    <MapProvider>
      <Routes>
          <Route path="/" element={<MapPage />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/groups" element={<PrivateRoute><Groups /></PrivateRoute>} />
          <Route path="/group/:groupId" element={<PrivateRoute><Group /></PrivateRoute>} />
          <Route path="/group/:groupId/chat" element={<PrivateRoute><Chat /></PrivateRoute>} /> */}
      </Routes>
    </MapProvider>
  )
}

export default App
