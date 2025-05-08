import React from 'react'
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'

import { AuthContext } from './modules/AuthContext'
import {
    createStoryApi, getStoriesApi, subscribeApi, getSubscribedAuthorsStoriesApi,
    getStoriesByAuthorIdApi, likeStoryApi, dislikeStoryApi, commentApi,
    deleteStoryApi, updateProfileDescriptionApi
} from './modules/Api'

import 'maplibre-gl/dist/maplibre-gl.css'
import {Map, GeolocateControl, ScaleControl, FullscreenControl, NavigationControl,
    Popup, Marker, useMap
} from 'react-map-gl/maplibre'

import { Button, Form, Image, Carousel, Offcanvas,  ListGroup } from 'react-bootstrap';
import { ArrowLeft, List, BoxArrowRight, HandThumbsDownFill, 
    HandThumbsUpFill, ArrowUpCircleFill } from 'react-bootstrap-icons'

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
    const [newComment, setNewComment] = useState("")

    const [lastCenter, setLastCenter] = useState([37.61, 55.75])
    const [lastZoom, setLastZoom] = useState(9)
    const [zoomed, setZoomed] = useState(false)

    const [showMenu, setShowMenu] = useState(false)
    const [showAuthor, setShowAuthor] = useState(false)
    const [authorShowed, setAuthorShowed] = useState(null)

    const [showSubscriptions, setShowSubscriptions] = useState(false)
    const [subscriptions, setSubscriptions] = useState([])

    
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
        let dataFetched = await getStoriesByAuthorIdApi(authorId)
        let storiesFetched = dataFetched.stories
        let arr = new Array(...storiesFetched)
        arr.sort((a, b) => a.createdAt > b.createdAt ? -1 : (a.createdAt < b.createdAt ? 1 : 0))
        console.log("arr",arr)
        setStories(storiesFetched)
        setAuthorShowed(dataFetched)
        return dataFetched
    }

    function addSearchParam (tag, value) {
        setSearchParams((searchParams) => {
            searchParams.append(tag, value)
            return searchParams
        })
    }

    function addOrUpdateSearchParam (tag, value) {
        setSearchParams((searchParams) => {
            searchParams.set(tag, value)
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
        let arr = new Array(...allStories)
        let index = arr.findIndex(a => a.storyId == storyId)
        console.log("got id " + storyId+", got index " + index)
        if (index > -1) {
            let story = arr[index]
            setSelectedMarkerIndex(index)
            setStoryShowed(story)
            setNewComment("")
            setShowAuthor(false)
            setAuthorShowed(null)
            setShowMenu(false)
            setShowSubscriptions(false)
            setShowStory(true)
            console.log(story)
            mymap?.flyTo({
                center: [story.longitude, story.latitude],
                zoom: 15,
                speed: 1.5,
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
        let arr = new Array(...fetched)
        makeStoryShow(arr, storyId)
    }

    async function showAuthorStory (authorId, storyId) {
        let fetched = stories
        if (!fetchedInitialStory || !authorShowed || authorShowed.authorId != authorId) {
            let fetchedData = await fetchAuthorStories(authorId)
            fetched = fetchedData.stories
            setFetchedInitialStory(true)
        }
        // setShowAuthor(false)
        console.log("show author", fetched)
        let arr = new Array(...fetched)
        makeStoryShow(arr, storyId)
    }

    async function showAuthorPage (authorId) {
        
        let fetched = await fetchAuthorStories(authorId)
        console.log("author",fetched)
        let storiesFetched = fetched.stories

        let maxLon = 0
        let minLon = 180
        let maxLat = -90
        let minLat = 90
        storiesFetched.forEach(fetchedStory => {
            maxLon = fetchedStory.longitude > maxLon ? fetchedStory.longitude : maxLon
            minLon = fetchedStory.longitude < minLon ? fetchedStory.longitude : minLon
            maxLat = fetchedStory.latitude > maxLat ? fetchedStory.latitude : maxLat
            minLat = fetchedStory.latitude < minLat ? fetchedStory.latitude : minLat
        })

        console.log(maxLon, minLon)
        // mymap?.flyTo({
        //     center: [(maxLon + minLon) / 2, (maxLat + minLat) / 2],
        //     zoom: 5,
        //     speed: 1.5,
        //     curve: 1
        // })

        if(storiesFetched.length == 1) {
            mymap.flyTo({
                center: [maxLon, maxLat],
                zoom: 15,
                speed: 1.5,
                curve: 1
            })
        } else {
            let bbox = [[minLon, minLat], [maxLon, maxLat]];
            mymap.fitBounds(bbox, {
                padding: {top: 150, bottom: 150, left: 150, right: 150}
            })
        }

        

        setShowStory(false)
        setStoryShowed(null)
        setSelectedMarkerIndex(-1)
        setShowMenu(false)
        setShowSubscriptions(false)
        setShowAuthor(true)
    }

    async function makeSubsShowed() {
        setShowStory(false)
        setStoryShowed(null)
        setSelectedMarkerIndex(-1)
        setShowMenu(false)
        setShowAuthor(false)
        setAuthorShowed(null)
        setShowSubscriptions(true)
    }

    async function showMain() {
        await fetchData()
        setShowStory(false)
        setStoryShowed(null)
        setSelectedMarkerIndex(-1)
        setShowMenu(false)
        setShowAuthor(false)
        setAuthorShowed(null)
        setShowSubscriptions(false)
        mymap.flyTo({
            center: lastCenter,
            zoom: lastZoom,
            speed: 1.5,
            curve: 1
        })
    }

    useEffect(() => {
        console.log('useeffect')
        console.log(author)
        if (searchParams.has("subscriptions")) {
            makeSubsShowed()
            return
        }
        if (searchParams.has("authorId")) {
                    // setShowStory(false)
                    // setStoryShowed(null)
                    // setShowAuthor(true)
            let id = searchParams.get("authorId")
            if (id != author._id) {
                if (searchParams.has("storyId")) {
                    let idStory = searchParams.get("storyId")
                    showAuthorStory(id, idStory)
                    console.log('show story')
                } else {
                    showAuthorPage(id)
                    console.log('show page')
                }
            } else {
                console.log("ME")
                if (searchParams.has("storyId")) {
                    let idStory = searchParams.get("storyId")
                    showAuthorStory(null, idStory)
                } else {
                    showAuthorPage(null)
                    
                }
            }
        }
        else {
            if (searchParams.has("storyId")) {
                let id = searchParams.get("storyId")
                fetchAndSetStory(id)
            } else {
                showMain()
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

        let id = newStories[newStories.length - 1].storyId
        setSearchParams({"storyId": id})
        
        // setShowStory(true)
        // setSelectedMarkerIndex(newStories.length - 1)
        // setStoryShowed(newStories[newStories.length - 1])
        
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
        let updated = await getStoriesApi()
        let story = updated.find(a => a.storyId == storyId)
        setStoryShowed(story)
    }

    async function dislikeAndUpdate (storyId) {
        await dislikeStoryApi(storyId)
        let updated = await getStoriesApi()
        let story = updated.find(a => a.storyId == storyId)
        setStoryShowed(story)
    }

    async function sendComment (storyId) {
        await commentApi(storyId, newComment)
        setNewComment("")
        let updated = await getStoriesApi()
        let story = updated.find(a => a.storyId == storyId)
        console.log("new", story)
        setStoryShowed(story)
    }

    async function subscribe(authorId) {
        await subscribeApi(authorId)
        let updated
        if (searchParams.has("authorId")) {
            updated = await fetchAuthorStories(authorId)
            updated = updated.stories
        } else {
            updated = await fetchData()
        }
        if (searchParams.has("storyId")) {
            let story = updated.find(a => a.storyId == storyShowed?.storyId)
            setStoryShowed(story)
        }
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
                                    speed: 1.5,
                                    curve: 1
                                })
                                setZoomed(false)

                                setShowAuthor(false)

                                setShowStory(true)
                                setStoryShowed(story)
                                addOrUpdateSearchParam("storyId", story.storyId)
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
                
             
            </div>


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
                                speed: 1.5,
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
                <div className="storyAuthor">
                    <div style={{cursor: 'pointer'}} 
                    onClick={() => setSearchParams({"authorId": storyShowed?.authorId})}>
                    {storyShowed?.authorName}
                    </div>
                    {!storyShowed.authoredByMe &&
                    <button className='followButton' onClick={() => subscribe(storyShowed?.authorId)}>
                        {storyShowed?.subscribedByMe ? 'Отписаться' : 'Подписаться'}
                    </button>
                    }
                </div>
                {new Array(...storyShowed?.storyImages).length > 0 &&
                <Carousel className='storyImages' pause="hover" 
                controls={new Array(...storyShowed?.storyImages).length > 1} 
                indicators={new Array(...storyShowed?.storyImages).length > 1} >
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
                <div className="sendComment">
                    <textarea className='commentArea' rows={2} value={newComment}
                        placeholder='Напишите комментарий' id='commentArea'
                        onChange={(e) => {
                            setNewComment(e.target.value)
                        }} />
                        <div className="sendCommentButton">
                            <ArrowUpCircleFill size={32} 
                            style={{cursor: newComment.length > 0 ? 'pointer' : 'initial'}} 
                            color={newComment.length > 0 ? 'black' : 'gray'} 
                            onClick={() => {
                                if (newComment.length > 0) {
                                    sendComment(storyShowed.storyId)
                                }
                            }} />
                        </div>
                </div>
                
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
                    <div className="profilePageIcon">{authorShowed?.authorName[0]}</div>
                    {authorShowed?.authorName}
                    {authorShowed?.authorId != author._id &&
                    <button className='followButton' onClick={() => subscribe(authorShowed?.authorId)}>
                        {authorShowed?.subscribedByMe ? 'Отписаться' :'Подписаться'}
                    </button>}
                </div>
                {stories.length > 0 &&
                <div className="authorStoriesBlock">
                    {stories.sort((a, b) => a.createdAt > b.createdAt ? -1 : (a.createdAt < b.createdAt ? 1 : 0)).map((story, i) => {
                        return(
                            <div className="authorStory" key={i} onClick={() => {
                                    setLastCenter(mymap.getCenter())
                                    setLastZoom(mymap.getZoom())
                                
                                addOrUpdateSearchParam("storyId", story?.storyId)
                                // makeStoryShow(stories, story.storyId)
                            }}>
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


            {/* ПОДПИСКИ */}
            {showSubscriptions &&
            <div className="subsPage">
            <div className="subsPageTitle">
                Ваши подписки
            </div>
            {subscriptions.length < 1 &&
            <div className="subsEmpty">Вы еще не подписаны на других авторов</div>
            }
            {stories.length > 0 &&
            <div className="subsBlock">
                {stories.map((story, i) => {
                    return(
                        <div className="subscriptionsAuthor" key={i} onClick={() => {
                            setSearchParams({"authorId": author._id})
                        }}>
                            <div className="subsAuthorTitle">
                                <div className="subsAuthorNameBlock">
                                    <div className="profilePageIcon">{stories[0]?.authorName[0]}</div>
                                    <div className="subsAuthorName">{story?.storyName}</div>
                                </div>
                                <button className='followButton' onClick={() => subscribe(stories[0]?.authorId)}>
                                    {new Array(...author.subscribersId).findIndex(id => id == stories[0]?.authorId) > -1 ?
                                    'Отписаться' :'Подписаться'}
                                </button>
                            </div>
                            <div className="subsBody">
                                <div className="subsText">{story?.storyText}</div>
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
                <div className="profileMenu" onClick={() => {
                    navigate("profile")
                }}>
                    <div className="profileMenuIcon">{author.name[0]}</div>
                    <div className="profileMenuName">{author.name}</div>
                </div>
                <div className="menuLinks">
                    <div className="menuLink" onClick={() => {
                        setShowMenu(false)
                        setSearchParams()}}>
                        Главная страница
                    </div>
                    <div className="menuLink" onClick={() => {
                        setShowMenu(false)
                        setSearchParams({"authorId": author._id})
                        // showAuthorPage(null)
                    }}>Мои истории</div>
                    <div className="menuLink" onClick={() => {
                        setShowMenu(false)
                        setSearchParams({"subscriptions": true})
                        getSubscribedAuthorsStoriesApi()
                    }}>Мои подписки</div>
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