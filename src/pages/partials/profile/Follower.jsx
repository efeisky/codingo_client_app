import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'

import './Follower.css'

import FollowerUser from './FollowerUser'

export const Follower = ({username,follower,followed}) => {
    const myRef = useRef(null)
    const [windowStatus, setWindowStatus] = useState(false)
    const [windowOption, setWindowOption] = useState('')
    const [FollowValue, setFollowValue] = useState([])
    const [rangeValues, setRangeValues] = useState({
        scroolTopRange : 1100,
        sliceRange : 15
    })
    
    const handleScroll = () => {
        if(myRef.current.scrollTop > rangeValues.scroolTopRange){
            setRangeValues({
                scroolTopRange: 2100,
                sliceRange : 25
            })
        }
    }

    const setData = async (unm,type) => {
        const follow = await axios.get('/getFollowValues',{
            params:{
                username : unm,
                type
            }
        })
        if(follow.data.status){
            setFollowValue([...follow.data.followDatas])
        }
    }
    
    useEffect(() => {
        if(windowOption !== ''){
            setData(username,windowOption)
        }
    }, [windowOption])
    
  return (
    <div className='followArea'>
        <div 
        className="follow" 
        onClick={()=>{
            setWindowStatus(true)
            setWindowOption('follower')
        }}
        >
            <span id='bold'>{follower}</span> 
            <span>Takipçi</span>
        </div>

        <div 
        className="follow" 
        onClick={()=>{
            setWindowStatus(true)
            setWindowOption('followed')
        }}
        >
            <span id='bold'>{followed}</span> 
            <span>Takip</span>
        </div>
        
        {windowStatus ? (
            <div className="openableFollowWindow">
                <div className="window">
                    <img 
                    src='/assest/img/GeneralIcons/profile_closeWindow.svg' 
                    alt='Pencereyi Kapat' 
                    id='close'
                    onClick={()=>{setWindowStatus(false)}}
                    />
                    {windowOption !== 'followed' ? (
                        <>
                            <div className="top">
                                {username} takipçileri
                            </div>
                            <div className="people" onScroll={handleScroll} ref={myRef}>
                            {FollowValue.slice(0, rangeValues.sliceRange).map((value, index) => {
                                return <FollowerUser key={index} picture={value.pictureSrc} unm={value.username} rnm={value.realname}/>
                            })}
                            {FollowValue.length > rangeValues.sliceRange ? (
                                <span id='loading'>Yükleniyor..</span>
                            ) : (
                                <></>
                            )}
                            </div>
                        
                        </>
                        ) : (
                        <>
                            <div className="top">
                                {username} takipleri
                            </div>
                            <div className="people">
                                {FollowValue.slice(0, rangeValues.sliceRange).map((value, index) => {
                                    return <FollowerUser key={index} picture={value.pictureSrc} unm={value.username} rnm={value.realname}/>
                                })}
                                {FollowValue.length > rangeValues.sliceRange ? (
                                    <span id='loading'>Yükleniyor..</span>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        ) : (
            <></>
        )}
    </div>
  )
}
