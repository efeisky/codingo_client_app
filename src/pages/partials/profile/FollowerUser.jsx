import React from 'react'
const FollowerUser = ({picture,unm,rnm}) => {
  const handleClick = () => {
    window.open(`/${unm}/profile`,'_self');
  }
  return (
    <div onClick={handleClick} id='linkUser' >
      <div className="userDiv">
          <img src={picture} alt='Kullanıcı Resmi'/>
          <div className="realName">{rnm}</div>
          <div className="userName">@{unm}</div>
      </div>
    </div>
    
  )
}

export default FollowerUser