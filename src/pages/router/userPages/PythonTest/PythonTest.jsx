import React, { useEffect,useState } from 'react'
import { decrypt } from '../getUserPages';

import QuestionMain from '../../../partials/lesson/question/Main/QuestionMain';
import Loader from './../../../partials/PartialLoader/Loader'
import './PythonTest.css'
import axios from 'axios';

const PythonTest = () => {
    const [isUploading, setIsUploading] = useState({
      status : false,
      title : ''
    })
    const [testStatus, setTestStatus] = useState(0)
    const searchParams = new URLSearchParams(window.location.search);
    const paramsObj = Object.fromEntries(searchParams.entries());
    let isAuth=false;
    let secretKey,plainUsername;
    try {
      const localData = JSON.parse(window.localStorage.getItem('token_profile'));
      secretKey = localData.authProperty;
      plainUsername = decrypt(localData.secretUsername,secretKey)
      if (plainUsername === paramsObj.username) { isAuth = true; } else { window.open(`/${plainUsername}`, '_self'); }
    } catch (err) {
      console.error(err)
    }
    
    const setPythonData = async(status) => {
      if(status === 0){
        const patch = await axios.patch('/setPythonData',{
          username : plainUsername,
          isKnow : false
        })
        if(patch.data.patchStatus){
          window.open(`/${plainUsername}`,'_self')
        }
        else{
          alert('İşleminiz yapılırken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.')
        }
      }
      else{
        const patch = await axios.patch('/setPythonData',{
          username : plainUsername,
          isKnow : true,
          level : status
        })
        if(patch.data.patchStatus){
          window.open(`/${plainUsername}`,'_self')
        }
        else{
          alert('İşleminiz yapılırken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.')
        }
      }
    }
    const [question, setQuestion] = useState([])
    const [permanentlyQuestionLenght, setPermanentlyQuestionLenght] = useState([])
    const setQuestionsForTest = async() => {
      const getQuestions = await axios.get('/getQuestion')
      if(getQuestions.data.status){
        setQuestion([...getQuestions.data.questionValues])
        setPermanentlyQuestionLenght([...getQuestions.data.questionValues])
        setIsUploading({
          status : false,
        })
      }
      else{
        alert('Sistemsel bir hata meydana geldi.')
      }
    }
    
    const setMode = (value) => {
      if(!value){
        setPythonData(0)
      }else{
        setTestStatus(1)
        setIsUploading({
          status : true,
          title : 'Sorular Getiriliyor..'
        })
        setQuestionsForTest()
      }
    }
    const [tempQuestion, setTempQuestion] = useState([])
    const [activeQuestion, setActiveQuestion] = useState(1)
    const [temp, setTemp] = useState({
      true : 0,
      false : 0
    })
    const machineLearningRequest = async(sessQuestion) => {
      const mlData = await axios.post('/pythonMachine',{
        result : tempQuestion
      })
      if(mlData.data.status){
        const data = mlData.data.data;
        if(data.status !== 'passed'){
          if(data.recommended_result < 0){
            setPythonData(0)
          }
          else{
            setPythonData(data.recommended_result)
          }
        }else{
          setIsUploading({
            status : false
          })
        }
        setQuestion(sessQuestion)
      }
      else{
        alert('Hata oluştu..')
      }
    }
    const increaseActiveQuestion = (no, id, result) => {
      setActiveQuestion(no);
      setTempQuestion((prev) => [
        ...prev,
        {
          QuestionID: id,
          QuestionStatus: result.true !== temp.true ? true : false,
        },
      ]);
    
      setTemp(result);
    };

    useEffect(() => {
      if ((activeQuestion - 1) % 3 === 0 && activeQuestion !== 1) {
        const sessQuestion = question.slice(3);
        setIsUploading({
          status: true,
          title: 'Cevapların Değerlendiriliyor..',
        });
        machineLearningRequest(sessQuestion);
      }
      else{
        return
      }
    }, [tempQuestion])
    
    
    const finishQuestion = () => {
      alert('Şuan için daha fazla soru bulunamadı.. Size ortalama bir sonuç vereceğiz.')
      setPythonData(Math.floor(permanentlyQuestionLenght.length / 2))
    }
    return (
      <div className='lessonPage'>
        {isUploading.status ? (
          <Loader title={isUploading.title} textColor={'#FFF'}/>
        ) : (
          testStatus ? (
            <div className="pythonLesson">
              <QuestionMain 
                  questions={question} 
                  nextedQuestion={increaseActiveQuestion}
                  finishedQuestion={finishQuestion}
              />
            </div>
          ) : (
            <div className='userPythonValue'>
                <h1>Hiç Python Biliyor Musunuz?</h1>
                <h2>Cevabınıza göre bilgileriniz ayarlanacaktır.</h2>
                <div className="buttons">
                  <button onClick={()=>setMode(1)}>Evet, biliyorum</button>
                  <button onClick={()=>setMode(0)}>Hayır, hiç bilgim yok</button>
                </div>
            </div>
          )
          
        )}
      </div>
    )
}

export default PythonTest