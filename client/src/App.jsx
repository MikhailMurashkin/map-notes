import {Routes, Route} from 'react-router-dom'
import {MapProvider} from 'react-map-gl/maplibre'

import PrivateRoute from './modules/PrivateRoute'
import { AuthProvider } from './modules/AuthContext'

import MapPage from './Map'
import Login from './Login'
import Register from './Register'
import Profile from './Profile'


const App = () => {

  return (
    <AuthProvider>
      <MapProvider>
        <Routes>
            <Route path="/" element={<PrivateRoute><MapPage /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/profile" element={<PrivateRoute> <Profile /> </PrivateRoute>} />
            {/* <Route path="/groups" element={<PrivateRoute><Groups /></PrivateRoute>} />
            <Route path="/group/:groupId" element={<PrivateRoute><Group /></PrivateRoute>} />
            <Route path="/group/:groupId/chat" element={<PrivateRoute><Chat /></PrivateRoute>} /> */}
        </Routes>
      </MapProvider>
    </AuthProvider>
  )
}

export default App
