import React from 'react'
import Header from '../../partials/PartialHeader/Header'
import { Link } from 'react-router-dom'
import './NotFound.css'

export const NotFound = () => {
  return (
    <div>
      <Header/>
      <div className="notFoundArea">
        <div className="texts">
          <h1>Sayfa Bulunamadı !</h1>
          <h2>Aradığın sayfayı aradık, taradık ama sonuç bulamadık :(</h2>
          <Link to={'/'}><button>Anasayfa'ya Dön</button></Link>
        </div>
        <div className="img">
          <img src='/assest/img/public/404.jpg' alt='Sayfanın Kedisi'/>  
        </div>
      </div>
    </div>
  )
}
