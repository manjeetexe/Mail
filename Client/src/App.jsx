import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './page/Home'
import Validator from './page/Validator'
import Bulkmailer from './page/BulkMailer'



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/validator" element={<Validator />} />
        <Route path="/bulkmailer" element={<Bulkmailer />} />
      </Routes>
    </Router>
  )
}

export default App