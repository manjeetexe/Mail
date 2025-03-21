import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './page/Home'
import Validator from './page/Validator'

import Navigate from './page/Navigate'
import Team from './page/team'
import Dashboard from './components/Dashboard';
import Layout from './layout'
import BulkMail from './components/BulkMail'
import SpamCheck from './components/Deleverable';
import Automation from './components/Shedule';



const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} /> 
          <Route path="/unlimited" element={<BulkMail />} />
          <Route path="/spam" element={<SpamCheck />} />
          <Route path="/validator" element={<Validator />} />
          <Route path="/automation" element={<Automation />} />
          

      </Route>
       \\
        <Route path='/developer' element={<Team />} />
       < Route path='/main' element={<Navigate />} />
      </Routes>
    </Router>
  )
}

export default App