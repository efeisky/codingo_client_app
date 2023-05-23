import React from 'react'
import Header from '../../partials/PartialHeader/Header'

import './Sitemap.css'
import { Link } from 'react-router-dom'

const Sitemap = () => {
  
  return (
    <>
       <Header/> 
       <div className="sitemapArea">
        <h1>Site Haritası</h1>
        <ul>
          <li><Link to={'/'}>Anasayfa</Link></li>
          <li><Link to={'/login'}>Giriş Yap</Link></li>
          <li><Link to={'/register'}>Kayıt Ol</Link></li>
          <li><Link to={'/forgetPassword'}>Şifremi Unuttum</Link></li>
          <li><Link to={'/about'}>Hakkımızda</Link></li>
          <li><Link to={'/ourPolicy'}>Politikalarımız</Link></li>
          <li><Link to={'/sitemap'}>Site Haritası</Link></li>
          <li><Link to={'/contact'}>İletişim Kur</Link></li>
          <li>Kullanıcı Profili</li>
          <li><Link to={'/searchProfile'}>Profil Ara</Link></li>
          <li>Profili Şikayet Et</li>
          <ul>
            <li>Kullanıcı Anasayfası</li>
            <li>Kullanıcı Ayarları</li>
            <li>Kullanıcı Profili</li>
            <li>Kullanıcı Notları</li>
            <li>Kullanıcı Ayarları</li>
            <li>Kullanıcı Ders Detayları</li>
          </ul>
        </ul>
       </div>
    </>
  )
}

export default Sitemap