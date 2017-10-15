import React from 'react'
import {Link} from 'react-router'

export default ({prev, next, prevTitle, nextTitle}) =>
    <div className="paginator">
        {prev && <Link to={prev} title={prevTitle} className="prev">Prev</Link>}
        {next && <Link to={next} title={nextTitle} className="next">Next</Link>}
    </div>