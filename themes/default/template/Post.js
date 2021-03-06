import React from 'react'
import collect from 'picidae-tools/browser/collect'
import moment from 'moment'
import {Link} from 'react-router'
import {group} from './Archive'

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

    return (
        <DocumentTitle title={`imCuttle - ${props.pageData.meta.title}`}>
            <div className="post">
                <div className="post-info">
                    <div className="post-info">
                        <span>Written&nbsp;</span>
                        <br/>
                        <span>on&nbsp;</span>
                        <time dateTime={props.pageData.meta.datetime}>{moment(props.pageData.meta.datetime).format('lll')}</time>
                    </div>
                </div>
                <h1 className="post-title">{props.pageData.meta.title}</h1>
                <div className="post-line"></div>
                {render()}
                <div className="pagination">
                    {pagination.prev && <Link to={'/' + pagination.prev._key} title={pagination.prev.title} className="left arrow">←</Link>}
                    {pagination.next && <Link to={'/' + pagination.next._key} title={pagination.next.title} className="right arrow">→</Link>}
                    <a href="#" className="top">Top</a>
                </div>
            </div>
        </DocumentTitle>
    )
}

export default collect()(View)