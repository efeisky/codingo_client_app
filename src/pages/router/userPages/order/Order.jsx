import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect,useState } from 'react';

import { decrypt } from '../getUserPages';
import Loader from '../../../partials/PartialLoader/Loader';
import axios from 'axios';
import OrderPartial from '../../../partials/user/order/OrderPartial';
import './order.css'
import Header from '../../../partials/PartialHeader/Header';

const Order = () => {

    const {usernameParam} = useParams()
    let isAuth=false;
    const [isUploading, setIsUploading] = useState(true)
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

    const [globalResult, setGlobalResult] = useState([])
    const [localResult, setLocalResult] = useState([])

    const [isFirst, setIsFirst] = useState(false)
    const [selectedResult, setSelectedResult] = useState(1)

    useEffect(() => {
      setIsFirst(false)
      if(selectedResult){
        axios.get('/api/getOrder',{
          params:{
            username : plainUsername,
            type:'local'
          }})
        .then(res => {
            if(res.data.status){
              setLocalResult([...res.data.result])
              res.data.result[0].rank  === 1|| 2 || 3 ? setIsFirst(true) : setIsFirst(false)
            }else{
              console.error('Bir hata oluştu..')
            }
          })
        .catch(err => console.error(err))
      }else{
        axios.get('/api/getOrder',{
          params:{
            username : plainUsername,
            type:'global'
          }})
        .then(res => {
            if(res.data.status){
              setGlobalResult([...res.data.result])
              res.data.result[0].rank  === 1|| 2 || 3 ? setIsFirst(true) : setIsFirst(false)
            }else{
              console.error('Bir hata oluştu..')
            }
          })
        .catch(err => console.error(err))
      }
      setIsUploading(false)
    }, [selectedResult])
    
    const handleChange = () => {
      if(selectedResult){
        setSelectedResult(0)
      }else{
        setSelectedResult(1)
      }
    }
  return (
    <>
    {isAuth ? (
      <>
      {isUploading ? (
          <Loader title='Bilgilerin Getiriliyor..'/>
      ) : (
        <>
          <Header/>
          <div className="users">
            <button className="changeMode" type='submit' onClick={handleChange}>Sıralama Modunu Değiştir</button>
            {selectedResult ? (
              <>
                <h1>Okul Çapında Sıralamam</h1>
                {isFirst ? (
                  localResult.map((item,key)=>(
                    <OrderPartial
                      nowUsername={plainUsername}
                      rank={item.rank}
                      username={item.username}
                      realname={item.realName}
                      score={item.userScore}
                      picture={item.pictureSrc}
                      key={key}
                      orderRank={item.rank === 1 ? 'firstUser' : (item.rank === 2 ? 'secondUser' : (item.rank === 3 ? 'thirdUser' : item.rank))}
                    />
                  ))

                ) : (
                  localResult.map((item,key)=>(
                    <OrderPartial
                      nowUsername={plainUsername}
                      rank={item.rank}
                      username={item.username}
                      realname={item.realName}
                      score={item.userScore}
                      picture={item.pictureSrc}
                      key={key}
                      orderRank={item.rank}
                    />
                  ))

                )}
              </>
            ) : (
              <>
                <h1>Uygulama Çapında Sıralamam</h1>
                {isFirst ? (
                  globalResult.map((item,key)=>(
                    <OrderPartial
                      nowUsername={plainUsername}
                      rank={item.rank}
                      username={item.username}
                      realname={item.realName}
                      score={item.userScore}
                      picture={item.pictureSrc}
                      key={key}
                      orderRank={item.rank === 1 ? 'firstUser' : (item.rank === 2 ? 'secondUser' : (item.rank === 3 ? 'thirdUser' : item.rank))}
                    />
                  ))

                ) : (
                  globalResult.map((item,key)=>(
                    <OrderPartial
                      nowUsername={plainUsername}
                      rank={item.rank}
                      username={item.username}
                      realname={item.realName}
                      score={item.userScore}
                      picture={item.pictureSrc}
                      key={key}
                      orderRank={item.rank}
                    />
                  ))

                )}

              </>
            )}
            
          </div>
          
        </>
      )}
      </>
    ) : (
      <></>
    )}
  </>
  )
}

export default Order
