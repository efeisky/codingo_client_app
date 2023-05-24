import React,{useState,useEffect} from 'react'
import { useLocation } from "react-router-dom"
import Loader from '../../../partials/PartialLoader/Loader';
import LessonDetail from '../../../partials/user/detailLesson/LessonDetail';
import axios from 'axios';
import { decrypt } from '../getUserPages';
import { useParams } from 'react-router-dom'
import Header from '../../../partials/PartialHeader/Header';
import './DetailLesson.css'
const DetailLesson = () => {
    const [params, setParams] = useState(null);
    const [lessonInfo, setLessonInfo] = useState(null);
    const [isUploading, setIsUploading] = useState(true)
    const location = useLocation();
    const {usernameParam} = useParams()
    const [lessonName, setLessonName] = useState('')

    let isAuth=false;
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
    

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const value = queryParams.get('lessonName')
        setParams(value)
    }, [])
    const [maxValue, setMaxValue] = useState(0)
    const getLessonDetailsByLessonNameAndClass = (lessonName,username) => {
        axios.get('/api/getLessonDetailsByLessonName',{
            params: {
                lessonName,
                username
            }
        })
        .then((res) => {
            if(res.data.status){
                setLessonInfo(res.data.lessonDatas)
                setIsUploading(false)
                setMaxValue(res.data.maxValue)
            }
            else{
                window.open(`/${plainUsername}`,'_self')
            }
        })
    }

    useEffect(() => {
        if(params !== null){
            getLessonDetailsByLessonNameAndClass(params,plainUsername)
            if(params === 'math'){
                setLessonName('Matematik Dersleri')
            }else{
                setLessonName('Python Dersleri')
            }
        }
    }, [params])

    
  return (
    <>
    {isAuth ? (
        <>
            
            {isUploading ? (
                <Loader title='Ders Detayı Alınıyor..'/>
            ) : (
                <>
                    <Header/>
                    <h1 id='lessonNameHeader'>{lessonName}</h1>
                    {lessonInfo.length !== 0 ? (
                        <div className="lessonArea">
                            {lessonInfo.map((item, index) => (
                                <LessonDetail max={maxValue} lessonID={item.id} subject={item.Subject} lesClass={item.Class} questionCount={item.QuestionCount} lessonName={params} lesResult={item.lessonResult} lesDate={item.lessonDate} key={index}/>
                            ))}
                        </div>

                    ) : (
                        <div className='notFound'>
                            <img src='/assest/img/GeneralIcons/profile_NotFound.svg' alt='Uyarı Resmi'/>

                            <h1>Bu sınıf düzeyine ait ders bulunamadı</h1>
                            <span>En kısa zamanda bu sorunu çözmeye çalışacağız..</span>
                        </div>
                    ) }
                </>
            )}
        </>
    ) : (
        <></>
    )}
    </>
  )
}

export default DetailLesson
