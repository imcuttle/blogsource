import React from 'react'

import '../assets/style.less'

import Header from './Comps/Header'
import Footer from './Comps/Footer'

class Layout extends React.Component {

    render() {
        const {pluginData: {utils}} = this.props;
        return (
            <div className="wrap">
                <Header />
                <main>{this.props.children}</main>
                <Footer/>
            </div>
        )
    }
}


export default Layout