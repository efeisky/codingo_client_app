import React from 'react'

import QRScanner from './../../partials/searchProfile/QRScanner'
import SearchBar from '../../partials/searchProfile/SearchBar'
import Header from '../../partials/PartialHeader/Header'

const SearchProfile = () => {
  return (
    <>
      <Header/>
      <SearchBar/>
      <QRScanner/>
    </>
    
  )
}

export default SearchProfile