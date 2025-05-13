import React from 'react'
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from './modules/AuthContext'
import {
    getMyProfileInfoApi, updateProfileDescriptionApi
} from './modules/Api'

import { Modal, Form, Button } from 'react-bootstrap'
import { BoxArrowRight, House, Journals, PeopleFill, PersonPlusFill,
            PencilSquare } from 'react-bootstrap-icons'
import Loading from './Loading'

const Profile = () => {
    const { login, author, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [data, setData] = useState(null)
    const [newDescription, setNewDescription] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    
    async function getProfileData() {
        let fetched = await getMyProfileInfoApi()
        setData(fetched)
        console.log(fetched)
        if (!isLoaded) {
            setIsLoaded(true)
        }
    }
  
    useEffect(() => {
        getProfileData()
    }, [])

    async function updateDescription () {
        await updateProfileDescriptionApi(newDescription)
        await getProfileData()
        setShowModal(false)
    }
  
    if (isLoaded) {
    return (
        <div className="profile">
            <div className="profileIcon">
                {!data?.image || data.image.length < 1 ? author.name[0] : '' }
            </div>
            <div className="profileName">{author.name}</div>
            <div className="profileDescription">
                <div className="profileDescriptionTitle">
                    О себе:
                    <PencilSquare size={18} color='rgb(117,117,117)' style={{cursor: 'pointer', marginTop: "5px"}}
                    onClick={() => {
                        setNewDescription(data.description)
                        setShowModal(true)
                    }} />
                </div>
                {(data?.description && data.description.length > 0) ? 
                data.description : 'Описания еще нет'}
            </div>
    
            <div className="profileButtons">
                <div className="profileButton" onClick={() => {
                    navigate({
                        pathname: "/",
                        search: createSearchParams({
                            "authorId": author._id
                        }).toString()
                    })
                }}>
                    <Journals size={24} />
                    {data?.stories.length} историй опубликовано
                </div>
                <div className="profileButton" onClick={() => {
                    navigate({
                        pathname: "/",
                        search: createSearchParams({
                            "subscriptions": true
                        }).toString()
                    })
                }}>
                    <PersonPlusFill size={24} />
                    {data?.subscriptions.length} подписок
                </div>
                <div className="profileButton" style={{cursor: 'initial'}}>
                    <PeopleFill size={24} />
                    {data?.subscribers.length} подписчиков
                </div>
            </div>
            <div className="profileButton" style={{paddingBottom: '60px'}} 
            onClick={() => navigate('/')}>
                    <House size={24} />
                    На главную страницу
            </div>

            <div className="logoutButton" onClick={logout}>
                Выйти
                <BoxArrowRight size={18} color='#d00' />
            </div>

            <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                <Modal.Title>Редактирование описания</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Введите новое описание</Form.Label>
                    <Form.Control as="textarea" rows={3} value={newDescription} 
                    onChange={e => setNewDescription(e.target.value)} />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Отмена
                </Button>
                <button onClick={() => updateDescription()}>
                    Сохранить изменения
                </button>
                </Modal.Footer>
            </Modal>
        </div>
    );}
    else {
        return(
            <div style={{width: '100vw', height: '100vh'}}>
                <Loading />
            </div>
        )
    }
  };

export default Profile;