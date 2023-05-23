import React,{useState,useEffect} from 'react'
import './Actions.css'

import axios from 'axios'

const Actions = ({hasText,buttonStyles:{
    bgDark,
    fgColor,
    hFgColor,
    bgColor,
    hColor,
    border,
    hBorder
  },
  buttonText,iconSrc,hIconSrc,buttonID,action,uptoUsername
  
}) => {

  const [imageSrc, setImageSrc] = useState('')
  useEffect(() => {
    setImageSrc(iconSrc)
  }, [])
  
  const bgDarkEnter = () => {
    document.querySelector(`#${buttonID}`).style.backgroundColor = hColor
  };

  const bgDarkLeave = () => {
    document.querySelector(`#${buttonID}`).style.backgroundColor = bgColor
  };

  const bgLightEnter = () => {
    document.querySelector(`#${buttonID}`).style.backgroundColor = hColor
    document.querySelector(`#${buttonID}`).style.color = hFgColor
    document.querySelector(`#${buttonID}`).style.border = hBorder
    setImageSrc(hIconSrc)
  };

  const bgLightLeave = () => {
    document.querySelector(`#${buttonID}`).style.backgroundColor = bgColor
    document.querySelector(`#${buttonID}`).style.color = fgColor
    document.querySelector(`#${buttonID}`).style.border = border
    setImageSrc(iconSrc)
  };

  const handleClick = () => {
    

    if(uptoUsername !== undefined){
      if(buttonID === 'chat'){
        window.open(action,'_self')
      }
      if(buttonID === 'like'){
        if(action === uptoUsername){
          alert('Kendi profilini beğenemezsin.')
        }else{
          const fetch = async () => {
            const data = await axios.post('/profileActions',{
              transaction : 'like',
              utp:action,
              upto:uptoUsername
            })
            return data;
          }
          fetch().then(result => {
            if(!result.data.status){
              console.error('Başarısız işlem')
              if(result.data.errorMsg === "You already like this profile."){
                alert('Zaten bu kullanıcı profilini beğenmişsiniz.')
              }else{
                alert('Bir hata oluştu. Daha sonra tekrar deneyiniz.')
              }
            }
          }).catch(error => {
            console.error('Profili beğenirken bir problem oluştu.');
            alert('Bir problem oluştu, daha sonra tekrar deneyiniz')
          });
        }
       
      }
      if(buttonID === 'follow'){
        if(action === uptoUsername){
          alert('Kendi profilini takip edemezsin.')
        }else{
          const fetch = async () => {
            const data = await axios.post('/profileActions',{
              transaction : 'follow',
              utp:action,
              upto:uptoUsername
            })
            return data;
          }
          fetch().then(result => {
            if(!result.data.status){
              console.error('Başarısız işlem')
              if(result.data.errorMsg === "You already followed this profile."){
                alert('Zaten bu kullanıcı profilini takip ediyorsun.')
              }else{
                alert('Bir hata oluştu. Daha sonra tekrar deneyiniz.')
              }
            }
          }).catch(error => {
            console.error('Profili takip ederken bir problem oluştu.');
            alert('Bir problem oluştu, daha sonra tekrar deneyiniz')
          });
        }
      }
      if(buttonID === 'Report'){
        window.open(action,'_self')
      }
    }else{
      if(buttonID === 'homepage'){
        window.open(action,'_self')
      }else{
        window.open('/login','_self')
      }
    }
    
  }
  return (
    <>
      {bgDark ? (
        <div className='actionButton' style={{
          backgroundColor: bgColor,
          color: fgColor
        }} onMouseEnter={bgDarkEnter} onMouseLeave={bgDarkLeave} onClick={handleClick}
        id={buttonID}>
          {hasText ? (
            <>
              <div className="buttonIcon">
                <img src={iconSrc}/>
              </div>
              <div className="buttonText">{buttonText}</div>

            </>
          ) : (
            <>
              <div className="buttonIcon">
                <img src={iconSrc}/>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className='actionButton' style={{
          backgroundColor: bgColor,
          color: fgColor,
          border: border
        }} onMouseEnter={bgLightEnter} onMouseLeave={bgLightLeave} onClick={handleClick}
        id={buttonID}>
          {hasText ? (
            <>
              <div className="buttonIcon">
                <img src={imageSrc}/>
              </div>
              <div className="buttonText">{buttonText}</div>

            </>
          ) : (
            <>
              <div className="buttonIcon">
                <img src={imageSrc}/>
              </div>
            </>
          )}
        </div>
      )}
    </>
    
  )
}

export default Actions