import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'

// import { createGroup, getGroupsByUserId, joinGroupByCode } from './modules/Api'

import 'maplibre-gl/dist/maplibre-gl.css'
import {Map, GeolocateControl, ScaleControl, FullscreenControl, NavigationControl,
    Popup, Marker, useMap
} from 'react-map-gl/maplibre'

import { Button, Form } from 'react-bootstrap';

import Pin from './assets/pin'


let stories = [
    {
        authorId: "abc",
        authorName: "Name",
        storyId: "storyid1",
        storyName: "Story Name",
        storyText: "Story text",
        storyImages: ["link 1", "link 2"],
        date: new Date(),
        longitude: 37.64909959453797,
        latitude: 55.75413746010946
    },
    {
        authorId: "abcde",
        authorName: "Misha",
        storyId: "storyid2",
        storyName: "Story Misha Name",
        storyText: "Story text Misha",
        storyImages: ["link 1", "link 2"],
        date: new Date(),
        longitude: 37.91481238104444,
        latitude: 55.962609794694515
    },
    {
        authorId: "qwerty",
        authorName: "Varya",
        storyId: "storyid3",
        storyName: "Story Varya Name",
        storyText: "Story text Varya",
        storyImages: ["link 1", "link 2"],
        date: new Date(),
        longitude: 37.34458861624242,
        latitude: 55.81647271890208
    }
]


const MapPage = () => {
    const {mymap} = useMap()

    const [popupInfo, setPopupInfo] = useState(null)
    const [showPanel, setShowPanel] = useState(false)
    const [placeNewMarker, setPlaceNewMarker] = useState(false)
    const [mapDrag, setMapDrag] = useState(false)

    // const [newLatitude, setNewLatitude] = useState()
    // const [newLongitude, setNewLongitude] = useState('')
    // const [zoom, setZoom] = useState(9)

    const [newMarker, setNewMarker] = useState(false)


    useEffect(() => {
        async function fetchData(){

        }
        fetchData()
    }, [])

    let markers = [
        {
            latitude: 55.75,
            longitude: 37.61
        }
    ]


    return (
        <div style={{display: 'flex'}}>
        <div style={{flex: 'auto'}}>
            <Map
            id='mymap'
            initialViewState={{
                longitude: 37.61,
                latitude: 55.75,
                zoom: 9
            }}
            cursor={placeNewMarker ? (mapDrag ? 'grab' : 'url("/marker.png") 7 55, auto') : ''}
            // latitude={latitude}
            // longitude={longitude}
            // zoom={zoom}
            style={{width: '100%', height: '100vh', transitionDuration: '300ms', cursor: 'url("/marker.png"), auto'}}
            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
            onClick={(c)=>{
                if (!placeNewMarker) {
                    return
                }

                setNewMarker({
                    lat: c.lngLat.lat,
                    lng: c.lngLat.lng
                })

                let zoomValue = mymap.getZoom()

                console.log(c.lngLat.lat)
                console.log(c.lngLat.lng)
                
                mymap.flyTo({
                    center: [c.lngLat.lng, c.lngLat.lat],
                    zoom: zoomValue > 15 ? zoomValue : 15,
                    speed: 1,
                    curve: 1
                })

                // setNewLatitude(c.lngLat.lat)
                // setNewLongitude(c.lngLat.lng)
            }}

            onDragStart={() => {
                setMapDrag(true)
            }}
            onDragEnd={() => {
                setMapDrag(false)
            }}
            
            >
                <GeolocateControl />
                <ScaleControl />
                <FullscreenControl />
                <NavigationControl />

                {stories.map((story, key) => {
                    return (
                        <Marker
                            key={key}
                            latitude={story.latitude}
                            longitude={story.longitude}
                            anchor="bottom"
                            onClick={e => {
                                e.originalEvent.stopPropagation()
                                
                                mymap.flyTo({
                                    center: [story.longitude, story.latitude],
                                    zoom: 15,
                                    speed: 1.2,
                                    curve: 1
                                })
                            }}
                        >
                            <Pin />
                        </Marker>
                    )
                })}

                {newMarker && <Marker
                    key={`new-marker`}
                    latitude={newMarker.lat}
                    longitude={newMarker.lng}
                    anchor="bottom"
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        console.log("Marker")
                        setPopupInfo("Marker");
                        setShowPanel(true)
                    }}
                    >
                    <Pin />
                </Marker>}
                {/* <Popup
                    anchor="top"
                    latitude={55.75}
                    longitude={37.61}
                    onClose={() => {console.log('onClose')}}
                >
                    <div>
                    {'City'}, {'State'} |{' ??'}
                    <a
                        target="_new"
                        href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${'Moscow'}`}
                    >
                        Wikipedia
                    </a>
                    </div>
                    <img width="100%" src={'./assets/react.svg'} />
                </Popup> */}
            </Map>
        </div>
        <div style={{backgroundColor: 'pink', width: '500px'}}>
            {!newMarker && <Button onClick={()=>{
                if (placeNewMarker) {
                    setPlaceNewMarker(false)
                } else {
                    setPlaceNewMarker(true)
                }
            }}>
                {placeNewMarker ? 'Отменить' : 'Создать историю'}
            </Button>}
            {newMarker &&
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Название вашей истории</Form.Label>
                        <Form.Control placeholder="name@example.com" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Текст вашей истории</Form.Label>
                        <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                    <Button>
                        Создать
                    </Button>
                    <Button onClick={()=>{
                        setNewMarker(false)
                        setPlaceNewMarker(false)

                        mymap.flyTo({
                            center: [37.61, 55.75],
                            zoom: 9,
                            speed: 1,
                            curve: 1
                        })
                    }}>
                        Отменить
                    </Button>
                </Form>
            }
        </div>
        </div>
    )
}


export default MapPage