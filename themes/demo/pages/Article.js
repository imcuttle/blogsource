/**
 * @file: Article
 * @author: Cuttle Cong
 * @date: 2017/11/14
 * @description: 
 */
import React from 'react'
import collect from 'picidae-tools/browser/collect'

@collect()
export default class Article extends React.PureComponent {
  render() {
    const {render, themeConfig} = this.props
    return (
      <div>
        <h2>{JSON.stringify(themeConfig)}</h2>
        {render()}
      </div>
    )
  }
}
