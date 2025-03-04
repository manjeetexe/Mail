import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './page/Home'
import Validator from './page/Validator'



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/validator" element={<Validator />} />
      </Routes>
    </Router>
  )
}

export default App