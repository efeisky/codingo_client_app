import React, { useEffect,useState,useRef } from 'react'
import './Trial.css'
import Loader from './../../partials/PartialLoader/Loader'
import QuestionMain from '../../partials/lesson/question/Main/QuestionMain';
import axios from 'axios';
import { LessonHeader } from '../../partials/lesson/LessonHeader/LessonHeader';
import {Link} from 'react-router-dom'
const Trial = () => {
  const [isUploading, setIsUploading] = useState({
    status : false,
    title : ''
  })
  const [testStatus, setTestStatus] = useState(0)
  
  const [question, setQuestion] = useState([])

  const [activeQuestion, setActiveQuestion] = useState(1)
  const [nonPermission, setNonPermission] = useState(false)
  const setCookie = () => {
      const token = {
        exprDate : new Date().toISOString()
      }
      window.localStorage.setItem('trial_token',JSON.stringify(token))
  }
  const getCookie = () => {
    if(window.localStorage.getItem('trial_token')){
      setNonPermission(true)
    }
}
  const setQuestionsForTest = async(eduLevel,knowPy) => {
    
    const getQuestions = await axios.get('/api/getQuestionForTrial',{
      params:{
        eduLevel,
        knowPy
      }
    })
    if(getQuestions.data.status){
      if(getQuestions.data.questionValues.length === 0){
        setTestStatus(2)
      }
      setCookie()
      setQuestion([...getQuestions.data.questionValues])
      setIsUploading({
        status : false,
      })
    }
    else{
      alert('Sistemsel bir hata meydana geldi.')
    }
  }
  
  const setMode = () => {
      setTestStatus(1)
      setIsUploading({
        status : true,
        title : 'Sorular Getiriliyor..'
      })
      setQuestionsForTest(eduValue.plain,pythonMode.value)
  }

  const increaseActiveQuestion = (no, id, result) => {
    setActiveQuestion(no);
  };
  const finishQuestion = () => {
    //playAudio()
    setTestStatus(-1)
  }

  const [pythonMode, setPythonMode] = useState({
    state : true,
    value : 0
  })
  const [educationMenu, setEducationMenu] = useState(false)
  const [eduValue, setEduValue] = useState({
    plain : 0,
    styled : ''
  })
  const handleEduChange = (e) => {
    setEducationMenu(false)
    setEduValue({
      plain : parseInt(e.target.dataset.value),
      styled : e.target.dataset.value === '13' ? 'Mezun' : e.target.dataset.value + '. Sınıf'
    })
  }
  const [error, setError] = useState({
    state : 0
  })
  const startLesson = () => {
    if(eduValue.plain !== 0 && pythonMode.state === false){
      setMode()
    }else{
      setError({state : 1})
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
  useEffect(() => {
    getCookie()
    return () => {
      //stopAudio();
    };
}, []);
  return (
    <div className='lessonPage'>
      {isUploading.status ? (
        <Loader title={isUploading.title} textColor={'#FFF'}/>
      ) : (
        nonPermission ? (
          <div className='notFoundForTrial'>
              <img src='/assest/img/lessonIcons/notFound.svg' alt='Uyarı Resmi'/>
              <h1>Erişim Engeli</h1>
              <h2>Deneme dersleri tek kullanımlıktır. İkinci kullanıma erişim sağlamaz.</h2>
              <Link to={'/'}>Anasayfa'ya Dön</Link>
          </div>
        ) : (
          testStatus === 2 ? (
            <div className='notFound notQuestion'>
              <img src='/assest/img/lessonIcons/noQuestion.svg' alt='Uyarı Resmi' id='transted'/>
              <h1>Hiç soru bulunamadı !</h1>
              <h2>En kısa zamanda bu sorunu düzeltmeye çalışıyoruz..</h2>
            </div>
          ) : (
            testStatus === 1 ? (
            <>
              <LessonHeader 
              status={'question'}
              lessonSubject={'Deneme Dersi'} 
              questionCount={question.length}
              activeQuestion={activeQuestion}
              />
              <QuestionMain 
                  questions={question} 
                  nextedQuestion={increaseActiveQuestion}
                  finishedQuestion={finishQuestion}
              />
            </>
            ) : (
              testStatus === 0 ? (
                <div className='trial'>
                <h1>Deneme Dersine Hoş Geldin</h1>
                <h2>Vermiş olduğunuz cevaplara göre sorular ayarlanacaktır.</h2>
                <div className="eduArea">
                <div className='educationLevel' onClick={()=>setEducationMenu(true)}>{eduValue.plain ? (eduValue.styled) : (<>Eğitim Seviyenizi Giriniz</>)}</div>
                {educationMenu ? (
                  <div className="menuEdu">
                    <div className="primary">
                      <span>İlkokul</span>
                      <div className="optionsEdu">
                        <div className="option" data-value='1' onClick={handleEduChange}>1</div>
                        <div className="option" data-value='2' onClick={handleEduChange}>2</div>
                        <div className="option" data-value='3' onClick={handleEduChange}>3</div>
                        <div className="option" data-value='4' onClick={handleEduChange}>4</div>
                      </div>
                    </div>
                    <div className="medium">
                      <span>Ortaokul</span>
                      <div className="optionsEdu">
                        <div className="option" data-value='5' onClick={handleEduChange}>5</div>
                        <div className="option" data-value='6' onClick={handleEduChange}>6</div>
                        <div className="option" data-value='7' onClick={handleEduChange}>7</div>
                        <div className="option" data-value='8' onClick={handleEduChange}>8</div>
                      </div>
  
                    </div>
                    <div className="high">
                      <span>Lise</span>
                      <div className="optionsEdu">
                        <div className="option" data-value='9' onClick={handleEduChange}>9</div>
                        <div className="option" data-value='10' onClick={handleEduChange}>10</div>
                        <div className="option" data-value='11' onClick={handleEduChange}>11</div>
                        <div className="option" data-value='12' onClick={handleEduChange}>12</div>
                      </div>
                    </div>
                    <div className="graduate">
                      <span>Mezun</span>
                      <div className="optionsEdu">
                        <div className="option" data-value='13' onClick={handleEduChange}>Mezun</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                </div>
                {pythonMode.state ? (
                  <div className="pythonLevel">
                  <h2>Python Biliyor Musun?</h2>
                  <div className="buttons">
                  <button onClick={()=>setPythonMode({
                    state : false,
                    value : 1
                  })}>Evet</button>
                  <button onClick={()=>setPythonMode({
                    state : false,
                    value : 0
                  })}>Hayır</button>
                  </div>
                </div>
                ) : (
                  <></>
                )}
                {
                  error.state ? (
                    <>
                      <div id='error'>
                        <img src='/assest/img/GeneralIcons/circleWarn.svg' alt='Error İmage'/>
                        <span>Tüm bilgiler girilmelidir.</span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )
                }
                <div className='startDiv'>
                  <button id='startLesson' onClick={startLesson}>Derse Başla</button>
                </div>
                <h6>*Bu ders sadece tek seferliktir.</h6>
                </div>
              ) : (
                <div className='finishedLessonForTrial'>
                    <p>Ders Sona Erdi</p>
                    <div className="image">
                      <img src='/assest/img/lessonIcons/finish.jpg' alt='Kutlama Resmi'/>
                    </div>
                    <h2>Üye olarak, çok daha fazla soru çeşidi ile kendinizi geliştirin.</h2>
                    <div className="links">
                      <Link to={'/register'}>Bize Katıl</Link>
                    </div>
                </div>
              )
            )
          )
        )
      )}
      <audio ref={audioRef} src='/assest/audio/lesson.mp3' />
    </div>
  )
}

export default Trial
