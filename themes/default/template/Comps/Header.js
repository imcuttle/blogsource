import React from 'react'
import {Link} from 'react-router'

export default ({}) =>
    <nav className="nav">
        <div className="nav-container">
            <Link to={'/'}>
                <h2 className="nav-title">imCuttle</h2>
            </Link>
            <ul>
                <li><Link activeClassName={"active-header"} to={'/posts/1'}>Posts</Link></li>
                {/*<li><Link activeClassName={"active-header"} to={'/about'}>About Me</Link></li>*/}
            </ul>
        </div>
    </nav>