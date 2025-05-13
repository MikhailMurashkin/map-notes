import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'

const PrivateRoute = ( {children} ) => {
  const { author } = useContext(AuthContext)

  return author ? children : <Navigate to="/login" />
}

export default PrivateRoute