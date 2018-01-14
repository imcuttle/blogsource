import React from 'react'
import {Link} from 'react-router'

import DocumentTitle from 'react-document-title'
import CatalogueItem from './Comps/CatalogueItem'

export function group(data, name = '') {
    let group = [];
    for (let k in data.meta) {
        if (new RegExp('^' + name).test(k)) {
            group.push(Object.assign({}, data.meta[k], {_key: k}))
        }
    }
    return group.sort((a, b) =>
        new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    )
}

export default ({data, render, publicPath, pluginData: {utils}, themeConfig: {pageSize = 2}, params: {page = 1}}) => {
    let posts = group(data);
    let pagination = {};

    page = Number(page);
    let start = (page - 1) * pageSize;
    let end = start + pageSize;

    if (page * pageSize < posts.length) {
        pagination.next = page + 1;
    }
    if (page > 1) {
        pagination.prev = page - 1;
    }

    posts = posts.slice(start, end);

    return (
        <DocumentTitle title={`imCuttle - Page ${page}`}>
            <div className="catalogue">
                {
                    posts.map(({title, datetime, desc, _key, data, ...rest}, i) => {
                        // desc = render({
                        //     markdown: data,
                        //     meta: {title, datetime, ...rest}
                        // })
                        return <CatalogueItem key={i} datetime={datetime} to={_key} title={title} content={desc}/>
                    })
                }
                <div className="pagination">
                    {pagination.prev && <Link to={'/posts/' + pagination.prev} className="left arrow">←</Link>}
                    {pagination.next && <Link to={'/posts/' + pagination.next} className="right arrow">→</Link>}
                    <a href="#" className="top">Top</a>
                </div>
            </div>
        </DocumentTitle>
    )
}