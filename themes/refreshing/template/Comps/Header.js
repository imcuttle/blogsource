import React from 'react'
import {Link} from 'react-router'

export default ({publicPath}) =>
    <header>
        <Link to={'/'} className="logo-link">
            <img src={`${publicPath}favicon.png`}/>
        </Link>
        <ul className="nav nav-list">
            <li className="nav-list-item"><Link className="nav-list-link" activeClassName={"active"} to={'/posts/1'}>Posts</Link></li>
        </ul>
    </header>