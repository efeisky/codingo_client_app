import React, { useState } from 'react'
import Header from '../../partials/PartialHeader/Header'

import './Policy.css'

const Policy = () => {
    const [selectedPolicy, setSelectedPolicy] = useState({
        policyName : 'Güvenlik Politikası',
        policyNo : 1
    })
  return (
    <>
        <Header/>
        <div className="policyArea">
            <div 
            className="SecurityPolicy"
            onClick={()=>{
                setSelectedPolicy({
                    policyName : 'Güvenlik Politikası',
                    policyNo : 1
                })
            }}
            >
                <span>Güvenlik Politikamız</span>
            </div>
            <div 
            className="PrivacyPolicy"
            onClick={()=>{
                setSelectedPolicy({
                    policyName : 'Gizlilik Politikası',
                    policyNo : 2
                })
            }}
            >
                <span>Gizlilik Politikamız</span>
            </div>
            <div 
            className="TermsOfUseAndCookiePolicy"
            onClick={()=>{
                setSelectedPolicy({
                    policyName : 'Kullanım ve Çerez Politikası',
                    policyNo : 3
                })
            }}
            >
                <span>Kullanım ve Çerez Politikamız</span>
            </div>
        </div>
        <div className="policyText">
            {selectedPolicy.policyNo === 1 ? (
                <>
                    <h1>{selectedPolicy.policyName}</h1>
                    
                    <p>Biz, Codingo, müşterilerimize güvenli ve güvenilir bir deneyim sağlamak için en iyi uygulamaları uygularız.</p>
                    <h2>Bilgi Güvenliği</h2>
                    <p>Müşterilerimizin kişisel bilgileri bizim için önemlidir ve bu bilgilerin güvenliği konusunda titiz davranıyoruz. Kişisel bilgilerinizi korumak için gerekli adımları atıyoruz, ancak herhangi bir ihlal durumunda, derhal önlemler almaya çalışacağız.</p>
                    <h2>Siber Güvenlik</h2>
                    <p>Web sitemiz, müşterilerimize hizmet vermek için çevrimiçi bir varlık olarak işlev görür. Bu nedenle, web sitemizin güvenliği konusunda ciddiye alıyoruz. Web sitemizin güvenliği için düzenli olarak güvenlik testleri yaparız ve gerekli adımları atarız.</p>
                    <h2>Ödeme Bilgisi Güvenliği</h2>
                    <p>Web sitemiz üzerinden yapılan ödemeler, müşterilerimizin finansal bilgilerinin güvenliğini sağlamak için en son teknolojileri kullanıyoruz. Ödeme bilgileriniz, PCI uyumlu hizmet sağlayıcısı tarafından yönetilir ve saklanır.</p>
                    <h2>Güvenlik Politikası Değişiklikleri</h2>
                    <p>Bu güvenlik politikası, değiştirilebilir ve güncellenebilir. Bu nedenle, bu sayfayı düzenli olarak kontrol etmenizi öneririz. Bu sayfada yapılan değişiklikleri kabul ettiğinizi varsayacağız, bu nedenle politikayı düzenli olarak kontrol etmenizi öneririz.</p>
                </>
            ) : 
            selectedPolicy.policyNo === 2 ? (
                <>
                    <h1>{selectedPolicy.policyName}</h1>
                    
                    <p>Biz, Codingo, müşterilerimize özel bilgilerin korunmasını ve gizliliğini sağlamak için en iyi uygulamaları uygularız.</p>
                    <h2>Toplanan Bilgiler</h2>
                    <p>Web sitemizde, işlem yapmak için bazı kişisel bilgilerinizin toplanması gerekebilir. Bu bilgiler arasında adınız, e-posta adresiniz, posta adresiniz ve telefon numaranız yer alabilir. Bu bilgiler, işlemlerin tamamlanması ve sizinle iletişim kurmak için kullanılabilir.</p>
                    <h2>Bilgi Kullanımı</h2>
                    <p>Topladığımız kişisel bilgiler, işlemlerinizin tamamlanması ve müşteri hizmetlerimizin sağlanması için kullanılabilir. Bu bilgiler, web sitemizdeki deneyiminizi iyileştirmek ve web sitemizi geliştirmek için de kullanılabilir.</p>
                    <h2>Bilgi Paylaşımı</h2>
                    <p>Topladığımız kişisel bilgileri, yasal olarak talep edildiğinde ve gerektiğinde yasalara uygun olarak paylaşabiliriz. Ayrıca, web sitemizi işleten üçüncü taraf hizmet sağlayıcıları ile bazı kişisel bilgilerinizi paylaşabiliriz, ancak yalnızca işlemlerinizin tamamlanması ve müşteri hizmetlerimizin sağlanması için gerekli olan bilgileri paylaşacağız.</p>
                    <h2>Çerezler</h2>
                    <p>Web sitemiz, kullanıcı deneyimini iyileştirmek ve web sitemizi geliştirmek için çerezler kullanır. Bu çerezler, web sitemize erişim yapan cihazınızda saklanır ve genellikle web tarayıcınızda ayarlanan tercihlere göre silinir.</p>
                    <h2>Gizlilik Politikası Değişiklikleri</h2>
                    <p>Bu gizlilik politikası, değiştirilebilir ve güncellenebilir. Bu nedenle, bu sayfayı düzenli olarak kontrol etmenizi öneririz. Bu sayfada yapılan değişiklikleri kabul ettiğinizi varsayacağız, bu nedenle politikayı düzenli olarak kontrol etmenizi öneririz.</p>
                </>
            ) : (
                <>
                    <h1>{selectedPolicy.policyName}</h1>

                    <p>Bu kullanım ve çerez politikası, Codingo tarafından işletilen web sitesinin (bundan sonra "Web Sitesi" olarak anılacaktır) kullanımı için geçerlidir.</p>
                    <h2>Kişisel Bilgilerin Toplanması</h2>
                    <p>Web sitemizi ziyaret ettiğinizde, sizden kişisel bilgiler toplayabiliriz. Bu bilgiler, adınız, e-posta adresiniz, telefon numaranız veya konum bilginiz gibi bilgiler olabilir. Bu bilgiler, size hizmetlerimizi sunmak, web sitemizi iyileştirmek ve müşteri hizmetlerimizi sağlamak için kullanılabilir.</p>
                    <h2>Çerezlerin Kullanımı</h2>
                    <p>Web sitemizde çerezleri kullanıyoruz. Çerezler, web sitemizi kullanımınızı analiz etmek, tercihlerinizi hatırlamak ve web sitemizin performansını ve kullanıcı deneyimini iyileştirmek için kullanılır. Ayrıca, reklamları kişiselleştirmek ve sosyal medya özellikleri sağlamak için de kullanılabilirler. Çerezler hakkında daha fazla bilgi için lütfen çerez politikamızı okuyun.</p>
                    <h2>Bilgilerin Paylaşımı</h2>
                    <p>Bazı durumlarda, sizinle ilgili bilgileri üçüncü taraflarla paylaşabiliriz. Bunlar, hizmetlerimizi sunmak veya yasal zorunluluklar gerektirdiğinde olabilir. Kişisel bilgilerinizi asla satmayacağız veya kiralamayacağız.</p>
                    <h2>Gizlilik Politikası Değişiklikleri</h2>
                    <p>Bu kullanım ve çerez politikası, değiştirilebilir ve güncellenebilir. Bu nedenle, bu sayfayı düzenli olarak kontrol etmenizi öneririz. Bu sayfada yapılan değişiklikleri kabul ettiğinizi varsayacağız, bu nedenle politikayı düzenli olarak kontrol etmenizi öneririz.</p>
                </>
            )}
        </div>

    </>
  )
}

export default Policy