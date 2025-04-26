import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'

import { AuthContext } from './modules/AuthContext'
import {
    createStoryApi, getStoriesApi, getMyStoriesApi,
    getStoriesByAuthorIdApi, likeStoryApi, dislikeStoryApi
} from './modules/Api'

import 'maplibre-gl/dist/maplibre-gl.css'
import {Map, GeolocateControl, ScaleControl, FullscreenControl, NavigationControl,
    Popup, Marker, useMap
} from 'react-map-gl/maplibre'

import { Button, Form, Image, Carousel, Offcanvas,  ListGroup } from 'react-bootstrap';
import { ArrowLeft, List, BoxArrowRight, HandThumbsDownFill, HandThumbsUpFill } from 'react-bootstrap-icons'

import Pin from './assets/pin'
import Comments from './Comments'




const MapPage = () => {
    const { login, author, logout } = useContext(AuthContext);

    const {mymap} = useMap()

    const [searchParams, setSearchParams] = useSearchParams()

    const navigate = useNavigate()

    const [stories, setStories] = useState([])

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

    const [lastCenter, setLastCenter] = useState([37.61, 55.75])
    const [lastZoom, setLastZoom] = useState(9)
    const [zoomed, setZoomed] = useState(false)

    const [showMenu, setShowMenu] = useState(false)
    const [showAuthor, setShowAuthor] = useState(false)

    
    const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(-1)

    const [fetchedInitialStory, setFetchedInitialStory] = useState(false)

    async function fetchData(){
        let storiesFetched = await getStoriesApi()
        setStories(storiesFetched)
        console.log("fetched", stories)
        // setSearchParams({'authorId': 'abc'})
        
        return storiesFetched
    }

    async function fetchAuthorStories (authorId) {
        let storiesFetched = await getStoriesByAuthorIdApi(authorId)
        let arr = new Array(...storiesFetched)
        arr.sort((a, b) => a.createdAt > b.createdAt ? -1 : (a.createdAt < b.createdAt ? 1 : 0))
        console.log("arr",arr)
        setStories(arr)
        return storiesFetched
    }

    function addSearchParam (tag, value) {
        setSearchParams((searchParams) => {
            searchParams.append(tag, value)
            return searchParams
        })
    }

    function deleteSearchParamsTagAll (tag) {
        // setSearchParams((searchParams) => {
        //     searchParams.delete(tag)
        //     console.log(searchParams.toString())
        //     return searchParams
        // })
    }

    function deleteSearchParamsTagValue (tag, value) {
        setSearchParams((searchParams) => {
            searchParams.delete(tag, value)
            return searchParams
        })
    }

    function goBack () {
        navigate(-1)
    }

    function makeStoryShow(allStories, storyId) {
        let index = allStories.findIndex(a => a.storyId == storyId)
        if (index > -1) {
            let story = allStories[index]
            setSelectedMarkerIndex(index)
            setShowStory(true)
            setStoryShowed(story)
            console.log(story)
            mymap?.flyTo({
                center: [story.longitude, story.latitude],
                zoom: 15,
                speed: 1.3,
                curve: 1
            })
        }
    }

    async function fetchAndSetStory (storyId) {
        let fetched = stories
        if (!fetchedInitialStory) {
            fetched = await fetchData()
            setFetchedInitialStory(true)
        }
        setShowAuthor(false)
        let arr = new Array(...fetched)
        makeStoryShow(arr, storyId)
    }

    useEffect(() => {
        console.log('useeffect')
        console.log(author)
        if (searchParams.has("authorId")) {
            let id = searchParams.get("authorId")
            if (id != author._id) {
                let storiesByAuthor = fetchAuthorStories(id)
                if (searchParams.has("storyId")) {
                    let idStory = searchParams.get("storyId")
                    makeStoryShow(storiesByAuthor, idStory)
                } else {
                    mymap?.flyTo({
                        center: [37.61, 55.75],
                        zoom: 9,
                        speed: 1.3,
                        curve: 1
                    })
                }
            } else {
                console.log("ME")
            }
        }
        else {
            if (searchParams.has("storyId")) {
                let id = searchParams.get("storyId")
                fetchAndSetStory(id)
            } else {
                fetchData()
                
            }
        }
    }, [searchParams])


    async function createStory () {
        await createStoryApi(newStoryName, newStoryText, ["https://www.hdwallpapers.in/thumbs/2021/lake_with_reflection_of_mountain_and_clouds_4k_hd_nature-t2.jpg"],
            newMarker.lng, newMarker.lat
        )
        let newStories = await fetchData()

        setNewMarker(false)
        setPlaceNewMarker(false)
        setNewStoryName('')
        setNewStoryText('')
        setNewStoryImages([])

        
        setShowStory(true)
        setSelectedMarkerIndex(newStories.length - 1)
        setStoryShowed(newStories[newStories.length - 1])
        
    }

    async function getStoriesByAuthor (authorId) {
        await fetchAuthorStories(authorId)
        setShowStory(false)
        setSelectedMarkerIndex(-1)
        setStoryShowed(null)
        setShowAuthor(true)
        // setFetch(!fetch)
        console.log("search", searchParams)
    }

    async function likeAndUpdate (storyId) {
        await likeStoryApi(storyId)
        let updated = await fetchData()
        let story = updated.find(a => a.storyId == storyId)
        setStoryShowed(story)
    }

    async function dislikeAndUpdate (storyId) {
        await dislikeStoryApi(storyId)
        let updated = await fetchData()
        let story = updated.find(a => a.storyId == storyId)
        setStoryShowed(story)
    }

    const formatDate = (dateStr) => {
        let timestamp = Date.parse(dateStr)
        let date = new Date(timestamp)
        let year = date.getFullYear()
        let month = date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1) : date.getMonth() + 1
        let day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate()
        let hour = date.getHours() < 10 ? '0'+date.getHours() : date.getHours()
        let minute = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()

        return day + '.' + month + '.' + year + ' в ' + hour + ':' + minute
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

                console.log("NEW")
                
                if (!newMarker) {
                    setLastCenter(mymap.getCenter())
                    setLastZoom(mymap.getZoom())
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
                    speed: 1.3,
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

            onZoomEnd={() => {
                if (mymap.getZoom() != 15) {
                    setZoomed(true)
                }
            }}
            
            >
                <GeolocateControl />
                <ScaleControl />
                {/* <FullscreenControl /> */}
                <NavigationControl />

                {/* ВСЕ МАРКЕРЫ И ONCLICK */}
                {stories.map((story, key) => {
                    return (
                        <Marker
                            key={key}
                            latitude={story.latitude}
                            longitude={story.longitude}
                            anchor="bottom"
                            onClick={e => {
                                e.originalEvent.stopPropagation()

                                setSelectedMarkerIndex(key)


                                setZoomed(false)
                                
                                if(!showStory) {
                                    setLastCenter(mymap.getCenter())
                                    setLastZoom(mymap.getZoom())
                                }
                                
                                mymap.flyTo({
                                    center: [story.longitude, story.latitude],
                                    zoom: 15,
                                    speed: 1.3,
                                    curve: 1
                                })
                                setZoomed(false)

                                setShowAuthor(false)

                                setShowStory(true)
                                setStoryShowed(story)
                                addSearchParam("storyId", story.storyId)
                                console.log(story)
                                console.log("marker click")
                            }}
                        >
                            <Pin selected={selectedMarkerIndex == key} />
                        </Marker>
                    )
                })}

                {/* НОВЫЙ МАРКЕР */}
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
                    <Pin selected={true} />
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
                {/* <Button onClick={() => navigate(-1)}>back</Button> */}
                {!newMarker && 
                <button className='mapButton' onClick={()=>{
                    setShowStory(false)
                    setStoryShowed(null)
                    setSelectedMarkerIndex(-1)

                    if (placeNewMarker) {
                        setPlaceNewMarker(false)
                    } else {
                        setPlaceNewMarker(true)
                    }
                }}>
                    {placeNewMarker ? 'Отменить' : 'Создать историю'}
                </button>}
                <List size={24} className='menuButton' onClick={() => setShowMenu(true)} />
                
                {/* <div className="profilePic">
                    <Image src="/profile-icon.png" roundedCircle fluid 
                    style={{cursor: "pointer"}}/>
                    {author.name}
                </div> */}
            </div>
            {/* <button className='mapButton'>Создать историю</button> */}


            {/* НОВАЯ ИСТОРИЯ */}
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
                        <Form.Control onChange={e => setNewStoryImages(e.target.value)}
                        value={""} />
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
                                center: lastCenter,
                                zoom: lastZoom,
                                speed: 1.3,
                                curve: 1
                            })
                        }}>
                            Отменить
                        </Button>
                    </div>
                    
                </div>
            }

            {/* ИСТОРИЯ */}
            {(showStory && storyShowed) &&
            <div className="storyBlock">
                <ArrowLeft size={18} className='backButton' onClick={() => {
                    if (!zoomed) {
                        console.log(lastCenter)
                        mymap.flyTo({
                            center: lastCenter,
                            zoom: lastZoom
                        })
                    }
                    setShowStory(false)
                    setSelectedMarkerIndex(-1)

                    deleteSearchParamsTagAll("storyId")
                    goBack()
                }} />
                {/* <button onClick={() => {
                    if (!zoomed) {
                        console.log(lastCenter)
                        mymap.flyTo({
                            center: lastCenter,
                            zoom: lastZoom
                        })
                    }
                    setShowStory(false)
                    setSelectedMarkerIndex(-1)
                }}>
                    BACK
                </button> */}
                <div className="storyName">
                    {storyShowed?.storyName}
                </div>
                <div className="storyAuthor" onClick={() => setSearchParams({"authorId": storyShowed?.authorId})}>
                    {storyShowed?.authorName}
                    <button className='followButton'>
                        Подписаться
                    </button>
                </div>
                {new Array(...storyShowed?.storyImages).length > 0 &&
                <Carousel className='storyImages' pause="hover">
                    {storyShowed.storyImages.map((image, i) => {
                        return(
                            <Carousel.Item key={i}>
                                <img className='imageItem' src={image} />
                            </Carousel.Item>
                        )
                    })}
                </Carousel>
                }
                <div className="storyText">
                    {storyShowed?.storyText}
                </div>
                <div className="storyDate">
                    История опубликована {formatDate(storyShowed?.createdAt)}
                </div>
                <div className="likesBlock">
                    <div className="likes" onClick={() => {likeAndUpdate(storyShowed.storyId)}}>
                        <div className="likeIcon">
                            <HandThumbsUpFill size={26} 
                            color={storyShowed?.likedByMe ? "green" : "rgba(0,128,0,0.5)"} />
                        </div>
                        <div className="liketext" 
                        style = {{color: storyShowed?.likedByMe ? "green" : "rgba(0,128,0,0.5)"}}>
                            {storyShowed?.ammountOfLikes}
                        </div>
                    </div>
                    <div className="dislikes" onClick={() => {dislikeAndUpdate(storyShowed.storyId)}}>
                        <div className="likeIcon">
                            <HandThumbsDownFill size={26} 
                            color={storyShowed?.dislikedByMe ? "red" : "rgba(255,0,0,0.5)"}  />
                        </div>
                        <div className="liketext" style={{color: storyShowed?.dislikedByMe ? "red" : "rgba(255,0,0,0.5)"}}>
                            {storyShowed?.ammountOfDislikes}
                        </div>
                    </div>
                </div>

                <Comments list={storyShowed.comments} dateFunc={formatDate} />
                
            </div>
            }


            {/* СТРАНИЦА АВТОРА */}
            {showAuthor &&
            <div className="authorPage">
                <div className="authorPageName">
                <ArrowLeft size={18} className='backButton' onClick={() => {
                    // setShowStory(false)
                    // setSelectedMarkerIndex(-1)
                    setShowAuthor(false)
                    goBack()
                    // deleteSearchParamsTagValue("authorId", auth)
                }} />
                    <div className="profilePageIcon">{author.name[0]}</div>
                    {author.name}
                    <button className='followButton'>
                        Подписаться
                    </button>
                </div>
                {stories.length > 0 &&
                <div className="authorStoriesBlock">
                    {stories.map((story, i) => {
                        return(
                            <div className="authorStory" key={i}>
                                <div className="authorStoryName">{story?.storyName}</div>
                                <div className="authorStoryBody">
                                    {new Array(...story?.storyImages).length > 0 &&
                                    <div className="authorStoryImage">
                                        <img src={story.storyImages[0]} className='authorStoryImg' />
                                        {new Array(...story?.storyImages).length > 1 &&
                                        <div className="authorStoryImgOverlay">+{new Array(...story?.storyImages).length - 1}</div>
                                        }
                                    </div>
                                    }
                                    <div className="authorStoryText">{story?.storyText}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>}
            </div>}
        </div>

        <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement='end'>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Меню</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div className="profileMenu">
                    <div className="profileMenuIcon">{author.name[0]}</div>
                    <div className="profileMenuName">{author.name}</div>
                </div>
                <div className="menuLinks">
                    <div className="menuLink">Главная страница</div>
                    <div className="menuLink" onClick={() => {
                        getStoriesByAuthorIdApi()
                    }}>Мои истории</div>
                    <div className="menuLink">Мои подписки</div>
                </div>
                <div className="logoutButton" onClick={logout}>
                    Выйти
                    <BoxArrowRight size={18} color='#d00' />
                </div>
            </Offcanvas.Body>
        </Offcanvas>
        </div>
    )
}


export default MapPage