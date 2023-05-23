import React, { useState,useEffect,useRef } from 'react'
import { decrypt } from '../getUserPages';
import axios from 'axios'
import './LessonPage.css'
import Loader from '../../../partials/PartialLoader/Loader';
import {Link} from 'react-router-dom'

import { LessonHeader } from '../../../partials/lesson/LessonHeader/LessonHeader';
import { LessonInformation } from '../../../partials/lesson/LessonInformation/LessonInformation'
import QuestionMain from '../../../partials/lesson/question/Main/QuestionMain';

const LessonPage = () => {
    const [isUploading, setIsUploading] = useState(true)
    const [isAvailable, setIsAvailable] = useState(true)
    let isAuth=false;
    let secretKey,plainUsername;
    try {
      const localData = JSON.parse(window.localStorage.getItem('token_profile'));
      secretKey = localData.authProperty;
      plainUsername = decrypt(localData.secretUsername,secretKey)
      if (plainUsername) { isAuth = true; } else { window.open(`/`, '_self'); }
    } catch (err) {
      console.error(err)
      window.open(`/`,'_self')
    }
    const searchParams = new URLSearchParams(window.location.search);
    const paramsObj = Object.fromEntries(searchParams.entries());

    const [lesson, setLesson] = useState({
      subject : '',
      question : 0
    })
    const [information, setInformation] = useState({
      hasInformation : false,
      videoSrc : '',
      xml : ''
    })
    const [mode, setMode] = useState(0)
    const [activeQuestion, setActiveQuestion] = useState(1)
    const [question, setQuestion] = useState([])
    const setLessonData = async(lessonName,lessonClass,lessonNumber) => {
      const reqData = await axios.get('/lessonData',{
        params : {
          username : plainUsername,
          name : lessonName,
          lesClass :lessonClass,
          id : lessonNumber
        }
      })
      setIsUploading(false)
      if(reqData.data.alreadyTested === 0){
        if(reqData.data.status && reqData.data.isAvailable){
          setLesson({...reqData.data.lessonValues})
          if(reqData.data.informationValues.hasInformation){
            setInformation({...reqData.data.informationValues})
            setMode(1)
          }
          setQuestion([...reqData.data.questionValues])
        }else{
          setIsAvailable(false)
          let count = 3
          const interval = setInterval(() => {
            if(count <= 0){
              window.open(`/${plainUsername}`,'_self')
            }
            count --;
  
          }, 1000);
      
        }
      }else{
        setLesson({...reqData.data.lessonValues})
        setMode(-1)
      }
      
    }
    const changeMode = () => {
      setMode(0)
    }

    const increaseActiveQuestion = (no) => {
      setActiveQuestion(no)
    }
    const [score, setScore] = useState(0)

    const [noteMenu, setNoteMenu] = useState(false)
    const [nots, setNots] = useState([])
    const [notInput, setNotInput] = useState('')
    const saveNote = () => {
      setNots(prev => ([...prev,{
        content : notInput
      }]))
      setNotInput('')
    }
    const setUserScoreAndLesson = async(newScore,username,lesClass,lesName,lesNumber,lesResult) => {
      const set = await axios.post('/setAfterLesson',{
        username,
        addedScore : newScore,
        lessonClass : lesClass,
        lessonName : lesName,
        lessonOrder : lesNumber,
        lessonResult : {
          'trueAnswerCount':lesResult.true,
          'falseAnswerCount':lesResult.false
        },
        notValues : nots
      })
      if(!set.data.status){
        alert('Şuanda bir hata oluştu.. Daha sonra tekrar deneyiniz.')
      }
    }
    const audioRef = useRef(null);

    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    };

    const stopAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
    const finishQuestion = (testResult) => {
      let scoreToAdd = Math.floor(100 * (testResult.true / (testResult.true + testResult.false))) ? Math.floor(100 * (testResult.true / (testResult.true + testResult.false))) : 50
      setScore(scoreToAdd)
      setMode(2)
      setUserScoreAndLesson(scoreToAdd,plainUsername,paramsObj.class,paramsObj.lessonName,paramsObj.lessonNumber,testResult)
      playAudio()
    }
    useEffect(() => {
        setLessonData(paramsObj.lessonName,paramsObj.class,paramsObj.lessonNumber)
        return () => {
          stopAudio();
        };
    }, []);
  return (
    <div className='lessonPage'>
      {isUploading ? (
        <Loader title={'Ders Getiriliyor..'} textColor={'#FFF'}/>
      ) : (
        isAvailable ? (
        <>
          <LessonHeader 
          status={mode ? 'information' : 'question'}
          lessonSubject={lesson.subject} 
          questionCount={lesson.question}
          activeQuestion={activeQuestion}
          />
          {
            information.hasInformation && mode === 1 ? 
            (
              <LessonInformation 
              infoVideo={information.videoSrc} 
              infoTitle={lesson.subject} 
              infoXML={information.xml}
              changeActiveMode={changeMode}
              />
            ) : 
            mode === 0 ? (
              question.length === 0 ? 
              (
                <div className='notFoundLesson notQuestion'>
                  <img src='/assest/img/lessonIcons/noQuestion.svg' alt='Uyarı Resmi' id='transted'/>
                  <h1>Hiç soru bulunamadı !</h1>
                  <h2>En kısa zamanda bu sorunu düzeltmeye çalışıyoruz..</h2>
                  <Link to={`/practice?lessonName=${paramsObj.lessonName}`}>Pratik Yap</Link>
                </div>
              ) : 
              (
                <>
                  <div className="optionsArea">
                    <Link to={`/${plainUsername}`}>Anasayfa'ya Dön</Link>
                    <button onClick={()=>setNoteMenu(true)}>Not Ekle</button>
                  </div>
                  {
                    noteMenu ? (
                      <div className="noteArea">
                        <div className="noteMenu">
                          <img 
                          src='/assest/img/lessonIcons/closeWindow.svg' 
                          alt='Pencereyi Kapat' 
                          id='close'
                          onClick={()=>{setNoteMenu(false)}}
                          />
                          <h1>Not Ekle</h1>
                          <input 
                          type='text' 
                          placeholder='Notunuzu Giriniz'
                          value={notInput}
                          onChange={(e) => setNotInput(e.target.value)}/>
                          <button onClick={saveNote}>Notu Kaydet</button>
                          <h6>*Notun kaydedilmesi için dersi bitirmelisiniz.</h6>
                        </div>
                      </div>
                      
                    ) : (
                      <></>
                    )
                  }
                  <QuestionMain 
                  questions={question} 
                  nextedQuestion={increaseActiveQuestion}
                  finishedQuestion={finishQuestion}
                  />
                </>
                
              )
            ) : (
              mode !== -1 ? (
                <div className='finishedLesson'>
                  <p>Ders Sona Erdi</p>
                  <div className="image">
                    <img src='/assest/img/lessonIcons/finish.jpg' alt='Kutlama Resmi'/>
                  </div>
                  <div className='scoreText'>Bu dersten <span>{score}</span> puan kazandınız!</div>
                  <div className="links">
                    <Link to={`/${plainUsername}`}>Anasayfa'ya Dön</Link>
                    <Link to={`/practice?lessonName=${paramsObj.lessonName}`}>Pratik Yap</Link>
                  </div>
                </div>
              ) : (
                <div className='notFoundLesson notQuestion'>              
                  <img src='/assest/img/lessonIcons/alreadyTested.svg' alt='Uyarı Resmi'/>
                  <h1>Bu ders zaten yapılmış !</h1>
                  <h2>Bir dersi 2. kez tekrardan yapamazsınız. Bunun yerine pratik yapabilirsiniz.</h2>
                  <Link to={`/practice?lessonName=${paramsObj.lessonName}`}>Pratik Yap</Link>
                </div>
              )
              
            )
          }
          

        </>
        ) : (
          <div className='notFoundLesson'>
              <img src='/assest/img/lessonIcons/notFound.svg' alt='Uyarı Resmi'/>
              <h1>Bu ders bulunamadı !</h1>
              <h2>Sayfanız yönlendiriliyor..</h2>
          </div>
        )
        
      )}
      <audio ref={audioRef} src='/assest/audio/lesson.mp3' />
    </div>
  )
}

export default LessonPage