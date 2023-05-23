import React,{useState,useEffect} from 'react'
import { decrypt } from '../getUserPages';
import { useParams } from 'react-router-dom'
import axios from 'axios';
import Loader from '../../../partials/PartialLoader/Loader';
import ChatAreaMain from '../../../partials/user/chat/chatAreaMain';
import io from 'socket.io-client';
import Header from '../../../partials/PartialHeader/Header';

const socket = io.connect('http://localhost:8080');

const Chat = () => {

    const [params, setParams] = useState({})
    const {usernameParam} = useParams()
    let isAuth=false;
    const [isUploading, setIsUploading] = useState(true)

    const [eduLevel, setEduLevel] = useState(0)
    let secretKey,plainUsername;
    try {
      const localData = JSON.parse(window.localStorage.getItem('token_profile'));
      secretKey = localData.authProperty;
      plainUsername = decrypt(localData.secretUsername,secretKey)
      if (plainUsername === usernameParam) { isAuth = true; } else { window.open(`/${plainUsername}`, '_self'); }
    } catch (err) {
      console.error(err)
      window.open(`/${usernameParam}/profile`,'_self')
    }

    const setData = async() => {
      const reqData = await axios.get('/getUserMainpage',{
        params : {
          username : plainUsername
        }
      })
      setEduLevel(parseInt(reqData.data.eduLevel))
    }
    useEffect(() => {
      setData()
      setIsUploading(false)
      }, [])

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const paramsObj = Object.fromEntries(searchParams.entries());
        setParams(paramsObj);
      }, []);

      
    
    
  return (
    <>
    {isAuth ? (
        <>
        {
          isUploading ? (
            <Loader title='Sohbetlerin getiriliyor..'/>
          ) : (
            <>
              <Header/>
              <ChatAreaMain username={plainUsername} eduLevel={eduLevel} socketID={socket.id} socket={socket} params={params}/>
            </>
          )
        }
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default Chat