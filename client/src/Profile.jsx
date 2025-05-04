import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from './modules/AuthContext';

import Button from 'react-bootstrap/Button';
import { Eye, EyeSlash } from 'react-bootstrap-icons'

const Profile = () => {
    const [name, setName] = useState('Varya');
    const [email, setEmail] = useState('varya@email.com');
    const [password, setPassword] = useState('password');
    const [inputColor, setInputColor] = useState('grey');
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(false);
    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    async function getProfileData() {}
  
    useEffect(() => {
    }, [])
  
    return (
        <div className="profile"></div>
    );
  };

export default Profile;