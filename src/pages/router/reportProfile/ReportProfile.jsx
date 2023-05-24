import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'
import axios from 'axios'

import './ReportProfile.css'
const ReportProfile = () => {
    const [processValues, setProcessValues] = useState({
        utp : '',
        upto : '',
        textValue : ''
    })
    useEffect(() => {
        const url = new URL(window.location.href);
        const plainUpto = CryptoJS.AES.decrypt(url.searchParams.get('upto'), url.searchParams.get('vrk')).toString(CryptoJS.enc.Utf8);
        
        setProcessValues({
            utp : url.searchParams.get('utp'),
            upto : plainUpto,
            textValue : ''
        })
    }, [])
    const sendReport = async(e) => {
        e.preventDefault()
        
        const fetch = await axios.post('/api/sendReportProfile',{
            utp : processValues.utp,
            upto : processValues.upto,
            reportContent : processValues.textValue
        })

        if(fetch.data.sendStatus){
            window.open(`/${processValues.utp}/profile`,'_self')
        }else{
            console.error('Bir hata gerçekleşti.')
        }

    }
  return (
    <div className='reportProfile'>
        <h1>Profili Şikayet Et</h1>
        <form>
            <span>{processValues.utp} profilini Neden Şikayet Ediyorsun?</span>
            <textarea 
            placeholder='Buraya detaylı yazı eklemeniz, şikayet sonucunun daha hızlı ve doğru bir şekilde çıkmasını sağlamaktadır.'
            onChange={(e) => {
                setProcessValues(prev => {
                  return {...prev, textValue: e.target.value};
                });
            }}
            ></textarea>
            <button 
            type="submit"
            onClick={sendReport}
            >
            Şikayet Et
            </button>
        </form>
    </div>
  )
}

export default ReportProfile
