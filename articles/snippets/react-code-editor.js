import React from 'react'
import CodeEditor from 'react-code-editor'

const code =
`const hello = 'world'
`

export default (
    <div className="stage">
        <h4 style={{margin: 0}}>CodeEditor</h4>
        <CodeEditor
            language="javascript"
            className="javascript"
            tabSize={2}
            code={code}
            mountStyle={false}
            onChange={console.log}
        />
    </div>
)