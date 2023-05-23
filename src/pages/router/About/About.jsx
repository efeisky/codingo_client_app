import React from 'react'
import Header from '../../partials/PartialHeader/Header'

import './About.css'
const About = () => {
  return (
    <>
        <Header/>
        <div className="aboutText">
            <h1>Hakkımızda</h1>
            <p>Codingo, 2023 yılında kurulmuş bir online eğitim platformudur.</p>
            <p>Online eğitim platformumuz, öğrencilerin ve öğrenme tutkunu kişilerin hayatlarını değiştirmek için tasarlanmış modern bir öğrenme deneyimi sunar.</p>
            
            <h1>Vizyon ve Misyon</h1>
            <p>Amacımız, dünya genelindeki öğrencilerin eğitimlerini tamamlamalarına ve profesyonel hedeflerine ulaşmalarına yardımcı olmaktır. Yüksek kaliteli içerik, uygulamalı öğrenme deneyimleri ve özelleştirilmiş eğitim fırsatları sunarak, öğrencilerin ihtiyaçlarına ve hedeflerine uygun öğrenme yolculuğu sunmaktayız.</p>
            <p>Online eğitim platformumuz, öğrencilerin her zaman her yerde öğrenmelerine olanak tanır. Yüksek kaliteli video dersleri, pratik uygulama örnekleri, etkileşimli quiz'ler ve projeler, öğrencilerin kendi hızında ilerlemesine ve öğrenme sürecini en üst düzeye çıkarmasına yardımcı olur.</p>
            
            
            <h1>Yapay Zekamız</h1>
            <p>Kurulduğu günden bugüne, barındırdığı yapay zeka sistemleri ile eğitim teknolojisine değer katmakta olan Codingo, her geçen gün daha iyi yapay zeka algoritmalarını kullanıyor. Soruları hazırlarken hem insan zekasından hem de son zamanlarda çok konuşulan CHATGPT-4 ile ilerliyoruz.</p>
            <p>Pratik derslerinde, deneme derslerinde ve python seviye tespit sınavında yapay zekanın yararlarına başvuruyoruz.</p>
            <img src='/assest/img/public/artificial-intelligence.jpg' alt='Yapay Zeka Resmi'/>    
            
            <h1>Neden Biz ?</h1>
            <p>Öğrencilerimiz için sürekli olarak yeni dersler, programlar ve sertifikalar ekliyoruz. Öğrenme deneyimini daha da zenginleştirmek için farklı seviyelerdeki öğrencilerimiz için özelleştirilmiş öğrenme yolları sunuyoruz. Ayrıca, öğrencilerimizle sürekli iletişim halindeyiz ve onların geri bildirimlerine göre platformumuzu geliştiriyoruz.</p>
            <p>Eğitim fırsatlarını daha da genişletmek için, öğrencilerimizle işbirliği yaparak kariyer hedeflerine uygun özelleştirilmiş eğitimler sunuyoruz. Ayrıca, online topluluklarımızda öğrencilerimizin birbirleriyle etkileşim kurmalarını, fikir alışverişinde bulunmalarını ve bilgi paylaşmalarını sağlıyoruz.</p>
            <p>Online eğitim platformumuz, geleceğin liderlerini eğitmek için tasarlanmıştır. Öğrencilerimize ihtiyaçlarına uygun öğrenme deneyimleri sunmak için sürekli olarak kendimizi geliştiriyor ve yeniliklerimizle öğrencilerimizin hayatlarını değiştiriyoruz.</p>
        
            <h1>Kurucumuz</h1>
            <div className="creator">
                <div className="creatorText">
                    <h2>Efe Işık</h2>
                    <p>Merhaba, ben Efe Işık. Doğan Cüceloğlu Fen Lisesi'nde 10. Sınıf Öğrencisiyim. Yazılıma olan merakım Python'la başlamıştır. Daha sonrasında frontend, backend ve mobile alanlarında olacak şekilde devam etmiştir. Öğrendiğim bilgileri arttırmaya devam ediyorum.</p>
                </div>
                <img src='/assest/img/public/creator.enc' alt='Kurucu Resmi'/>
            </div>
            
        </div>
    </>
  )
}

export default About