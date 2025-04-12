import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'

// import { createGroup, getGroupsByUserId, joinGroupByCode } from './modules/Api'

import 'maplibre-gl/dist/maplibre-gl.css'
import {Map, GeolocateControl, ScaleControl, FullscreenControl, NavigationControl,
    Popup, Marker, useMap
} from 'react-map-gl/maplibre'

import { Button, Form, Image, Carousel } from 'react-bootstrap';

import Pin from './assets/pin'


let stories = [
    {
        authorId: "abc",
        authorName: "Name",
        storyId: "storyid1",
        storyName: "Story Name",
        storyText: "Story text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tincidunt volutpat nisl ut suscipit. Quisque porta volutpat pretium. Integer a felis vel felis pretium auctor et vel nisi. Donec vulputate elementum varius. Maecenas et purus a quam vehicula luctus. Quisque eget rutrum dui, a consequat sem. Phasellus sodales nisi diam, in fermentum neque laoreet quis. Sed porta ultricies porttitor. Vestibulum id vehicula neque. Curabitur maximus mi odio, sed semper orci tempor vitae. Nunc eget porttitor nulla, non ultricies neque. Vestibulum bibendum nisl non tristique commodo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        storyImages: ["https://s3.stroi-news.ru/img/krasivie-kartinki-peizazh-1.jpg", "https://avianity.ru/wp-content/uploads/moskva.jpg"],
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

    const [searchParams, setSearchParams] = useSearchParams()

    const [popupInfo, setPopupInfo] = useState(null)
    const [showPanel, setShowPanel] = useState(false)
    const [placeNewMarker, setPlaceNewMarker] = useState(false)
    const [mapDrag, setMapDrag] = useState(false)

    // const [newLatitude, setNewLatitude] = useState()
    // const [newLongitude, setNewLongitude] = useState('')
    // const [zoom, setZoom] = useState(9)

    const [newMarker, setNewMarker] = useState(false)
    const [newStoryName, setNewStoryName] = useState("")
    const [newStoryText, setNewStoryText] = useState("")
    const [newStoryImages, setNewStoryImages] = useState("")

    const [showStory, setShowStory] = useState(false)
    const [storyShowed, setStoryShowed] = useState(null)


    useEffect(() => {
        async function fetchData(){
            console.log(searchParams)
            setSearchParams({'authorId': 'abc'})
        }
        fetchData()
    }, [])

    let markers = [
        {
            latitude: 55.75,
            longitude: 37.61
        }
    ]

    function createStory () {
        let story = {
            authorId: "test",
            authorName: "Varya",
            storyName: newStoryName,
            storyText: newStoryText,
            storyImages: newStoryImages,
            date: new Date(),
            longitude: newMarker?.lng,
            latitude: newMarker?.lat
        }
        console.log(story)
    }


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
                                console.log(story)
                                setShowStory(true)
                                setStoryShowed(story)
                                
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
        <div className='rightBlock' style={{backgroundColor: 'white', width: '500px'}}>
            <div className="topHolder">
                {!newMarker && 
                <button className='mapButton' onClick={()=>{
                    if (placeNewMarker) {
                        setPlaceNewMarker(false)
                    } else {
                        setPlaceNewMarker(true)
                    }
                }}>
                    {placeNewMarker ? 'Отменить' : 'Создать историю'}
                </button>}
                <div className="profilePic">
                    <Image src="/profile-icon.png" roundedCircle fluid 
                    style={{cursor: "pointer"}}/>
                </div>
            </div>
            {/* <button className='mapButton'>Создать историю</button> */}
            {newMarker &&
                <div className='newMarkerBlock'>
                    <div className='inputBlock'>
                        <Form.Label>Название вашей истории</Form.Label>
                        <Form.Control value={newStoryName} 
                        onChange={e => setNewStoryName(e.target.value)} />
                    </div>
                    <div className='inputBlock'>
                        <Form.Label>Текст вашей истории</Form.Label>
                        <Form.Control as="textarea" rows={3} value={newStoryText} 
                        onChange={e => setNewStoryText(e.target.value)} 
                        className='descriptionTextara' />
                    </div>
                    <div className='inputBlock'>
                        <Form.Label>Фотографии</Form.Label>
                        <Form.Control  />
                    </div>
                    <div className="newStoryButtons">
                        <button onClick={createStory}>
                            Создать историю
                        </button>
                        <Button variant='secondary' onClick={()=>{
                            setNewMarker(false)
                            setPlaceNewMarker(false)
                            setNewStoryName('')
                            setNewStoryText('')
                            setNewStoryImages([])

                            mymap.flyTo({
                                center: [37.61, 55.75],
                                zoom: 9,
                                speed: 1,
                                curve: 1
                            })
                        }}>
                            Отменить
                        </Button>
                    </div>
                    
                </div>
            }
            {(showStory && storyShowed) &&
            <div className="storyBlock">
                <div className="storyName">
                    {storyShowed?.storyName}
                </div>
                <div className="storyAuthor">
                    {storyShowed?.authorName}
                    <button className='followButton'>
                        Подписаться
                    </button>
                </div>
                <Carousel className='storyImages' pause="hover">
                    {storyShowed.storyImages.map((image, i) => {
                        return(
                            <Carousel.Item key={i}>
                                <img className='imageItem' src={image} />
                            </Carousel.Item>
                        )
                    })}
                </Carousel>
                <div className="storyText">
                    {storyShowed?.storyText}
                </div>
                <div className="storyDate">
                    История написана 
                </div>
                
            </div>
            }
        </div>
        </div>
    )
}


export default MapPage