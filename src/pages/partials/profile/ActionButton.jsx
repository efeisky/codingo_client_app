import React from 'react'
import Actions from './actions'
import CryptoJS from 'crypto-js'
const ActionButton = ({realName,username,activeUsername}) => {
  const secretReportKey = CryptoJS.lib.WordArray.random(512).toString(CryptoJS.enc.Hex);
  const secretReport = CryptoJS.AES.encrypt(activeUsername, secretReportKey).toString();
  return (
    <div className='Buttons'>
          <Actions hasText={1} buttonStyles={{
            bgDark: true,
            fgColor: '#ffffff',
            bgColor: '#3ACD7E',
            hColor: '#38B571',
            border: false
          }}
          buttonText="Anasayfa'ya Dön"
          iconSrc='/assest/img/buttonIcons/Home.svg'
          buttonID='homepage'
          action={`/`}
          />
          <Actions hasText={1} buttonStyles={{
            bgDark: true,
            fgColor: '#ffffff',
            bgColor: '#6C63FF',
            hColor: '#554BF4',
            border: false
          }}
          buttonText={`${realName} ile Konuş`}
          iconSrc='/assest/img/buttonIcons/Chat.svg'
          buttonID='chat'
          uptoUsername={activeUsername}
          action={`/${activeUsername}/chat?vrd=profile&receiverU=${username}`}
          />
          <Actions hasText={1} buttonStyles={{
            bgDark: true,
            fgColor: '#ffffff',
            bgColor: '#EA4335',
            hColor: '#C92D20',
            border: false
          }}
          buttonText={`Profili Beğen`}
          iconSrc='/assest/img/buttonIcons/Heart.svg'
          buttonID='like'
          uptoUsername={activeUsername}
          action={username}
          />
          <Actions hasText={1} buttonStyles={{
            bgDark: false,
            fgColor: '#EAAF03',
            hFgColor: '#FFFFFF',
            bgColor: 'rgba(234,175,3,.1)',
            hColor: '#EAAF03',
            border: '.5px dashed #EAAF03',
            hBorder: '.5px dashed #D29E04'
          }}
          buttonText={`Takip Et`}
          iconSrc='/assest/img/buttonIcons/Follow.svg'
          hIconSrc='/assest/img/buttonIcons/FollowHover.svg'
          buttonID='follow'
          uptoUsername={activeUsername}
          action={username}
          />
          <Actions hasText={1} buttonStyles={{
            bgDark: true,
            fgColor: '#FFFFFF',
            bgColor: '#232323',
            hColor: '#232323',
            border: false,
          }}
          buttonText={`Şikayet Et`}
          iconSrc='/assest/img/buttonIcons/Report.svg'
          buttonID='Report'
          uptoUsername={activeUsername}
          action={`/reportProfile?utp=${username}&upto=${secretReport}&vrk=${secretReportKey}`}
          />
    </div>
  )
}

export default ActionButton