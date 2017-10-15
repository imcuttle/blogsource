import React from 'react'
import {Link} from 'react-router'
import moment from 'moment'

export default ({datetime, to, title, content}) =>
    <li className="post-list-item">
        <article className="post-block">
            <h2 className="post-title">
                <Link to={to} title={title} className="post-title-link">{title}</Link>
            </h2>
            <time className="post-info" dateTime={datetime}>{moment(datetime).format('ll')}</time>
            <div className="post-content">
                {content}
            </div>
            <Link className="read-more" to={to}>...more</Link>
        </article>
    </li>