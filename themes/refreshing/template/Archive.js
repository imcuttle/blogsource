import React from 'react'
import {Link} from 'react-router'

import DocumentTitle from 'react-document-title'
import CatalogueItem from './Comps/CatalogueItem'
import Paginator from './Comps/Paginator'
import SearchBar from './Comps/SearchBar'


export function group(data, name = '', keyword) {
  let group = [];
  if (keyword) {
    keyword = Array.isArray(keyword) ? keyword : [keyword];
  }
  for (let k in data.meta) {
    if (new RegExp('^' + name).test(k)) {
      if (
        keyword &&
        (keyword.some(word => data.meta[k].title.includes(word))
        || keyword.some(word => data.meta[k].desc.includes(word)))
      ) {
        group.push(Object.assign({}, data.meta[k], {_key: k}))
      }
      else if (!keyword) {
        group.push(Object.assign({}, data.meta[k], {_key: k}))
      }
    }
  }
  return group.sort((a, b) =>
    new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
  )
}

export default ({data, render, publicPath, pluginData: {utils}, themeConfig: {pageSize = 2}, params: {page = 1, keyword = ''}}) => {
  let posts = group(data, void 0, keyword && decodeURIComponent(keyword).split(/[ -]/));
  let pagination = {};

  if (!keyword) {
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
  }

  const prev = pagination.prev ? '/posts/' + pagination.prev : null;
  const next = pagination.next ? '/posts/' + pagination.next : null;

  return (
    <DocumentTitle title={`imCuttle`}>
      <section className="container">
        <SearchBar />
        <ul className="home post-list">
          {
            posts.map(({title, datetime, desc, _key, ...rest}, i) => {
              // desc = render({
              //     markdown: desc,
              //     meta: {title, datetime, desc, _key, ...rest}
              // });
              return <CatalogueItem key={i} datetime={datetime} to={_key} title={title} content={desc}/>
            })
          }
        </ul>
        <Paginator prev={prev} next={next}/>
      </section>
    </DocumentTitle>
  )
}