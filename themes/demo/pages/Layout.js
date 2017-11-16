/**
 * @file: Article
 * @author: Cuttle Cong
 * @date: 2017/11/14
 * @description: 
 */
import React from 'react'
import collect from 'picidae-tools/browser/collect'

export default class Layout extends React.PureComponent {
  render() {
    const {children} = this.props

    return (
      <div>
        <h2>{'Layout'}</h2>
        {children}
      </div>
    )
  }
}
