import React from 'react'
import { Spinner } from 'react-bootstrap';

import './style/index.css'

function Loading () {
    return(
        <div className="loadingScreen">
            <Spinner animation="border" variant="secondary" />
        </div>
        
    )
}

export default Loading