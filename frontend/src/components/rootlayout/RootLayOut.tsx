import React from 'react'
import { Outlet } from 'react-router-dom'
import "./RootLayOut.css"
export default function RootLayOut() {
  return (
    <div>
       <nav>
        <ul>
          <li><a href="/">HOME</a></li>
          <li><a href="/categories">CATEGORIES</a></li>
        </ul>
      </nav>
      <Outlet></Outlet>
    </div>
  )
}
