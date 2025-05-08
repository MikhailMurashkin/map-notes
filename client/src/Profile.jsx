import React from 'react'
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from './modules/AuthContext'
import {
    getMyProfileInfoApi
} from './modules/Api'

import Button from 'react-bootstrap/Button'
import { BoxArrowRight, House, Journals, PeopleFill } from 'react-bootstrap-icons'

const Profile = () => {
    const { login, author, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [data, setData] = useState(null)
    
    async function getProfileData() {}
  
    useEffect(() => {
        getMyProfileInfoApi()
    }, [])
  
    return (
        <div className="profile">
            <div className="profileIcon">
                {!data ? author.name[0] : '' }
            </div>
            <div className="profileName">{author.name}</div>
            <div className="profileDescription">О себе:</div>
            <div className="profileButtons">
                <div className="profileButton" onClick={() => navigate('/')}>
                    <House size={24} />
                    На главную страницу
                </div>
                <div className="profileButton" onClick={() => {
                    navigate({
                        pathname: "/",
                        search: createSearchParams({
                            "authorId": author._id
                        }).toString()
                    })
                }}>
                    <Journals size={24} />
                    историй опубликовано
                </div>
                <div className="profileButton" onClick={() => {
                    navigate({
                        pathname: "/",
                        search: createSearchParams({
                            "subscriptions": true
                        }).toString()
                    })
                }}>
                    <PeopleFill size={24} />
                    подписок
                </div>
            </div>
            <div className="logoutButton" onClick={logout}>
                Выйти
                <BoxArrowRight size={18} color='#d00' />
            </div>
        </div>
    );
  };

export default Profile;