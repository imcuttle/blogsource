import React from 'react'
import collect from 'picidae-tools/browser/collect'
import moment from 'moment'
import {Link} from 'react-router'
import {group} from './Archive'
import Paginator from './Comps/Paginator'

import DocumentTitle from 'react-document-title'

function _pagination(key, data) {
    let list = group(data, '');
    let i = list.findIndex(x => x._key === key);
    return {
        prev: list[i-1],
        next: list[i+1],
        curr: list[i]
    }
}

const View = (props) => {
    let render = props.render;
    let publicPath = props.publicPath;
    let utils = props.pluginData.utils;

    let pagination = _pagination(props.location.pathname, props.data);
    const prev = pagination.prev ? ('/' + pagination.prev._key) : null
    const prevTitle = pagination.prev ? pagination.prev.title : null
    const next = pagination.next ? ('/' + pagination.next._key) : null
    const nextTitle = pagination.next ? pagination.next.title : null

    return (
        <DocumentTitle title={`${props.pageData.meta.title} - imCuttle`}>
            <div className="post">
                <article className="post-block">
                    <h1 className="post-title">{props.pageData.meta.title}</h1>
                    <div className="post-info">
                        <time dateTime={props.pageData.meta.datetime}>{moment(props.pageData.meta.datetime).format('lll')}</time>
                    </div>
                </article>
                <div className="post-content">
                    {render()}
                </div>
                <Paginator prev={prev} prevTitle={prevTitle} next={next} nextTitle={nextTitle}/>
            </div>
        </DocumentTitle>
    )
}

export default collect()(View)