import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './page/Home'
import Validator from './page/Validator'
import Bulkmailer from './page/BulkMailer'
import Navigate from './page/Navigate'
import Team from './page/team'
import Layout from './layout'



const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Layout />}>
          <Route index element={<Validator />} /> 
      </Route>
        
        <Route path="/validator" element={<Validator />} />
        <Route path="/bulkmailer" element={<Bulkmailer />} />
        <Route path='/team' element={<Team />} />
       < Route path='/main' element={<Navigate />} />
      </Routes>
    </Router>
  )
}

export default App