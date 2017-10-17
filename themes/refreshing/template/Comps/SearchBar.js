import React from 'react'

export default class SearchBar extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object
    }

    get router() {
        return this.context.router;
    }
    state = {
        value: decodeURIComponent(this.router.params.keyword || '')
    }

    render() {
        return (
            <div className="search-bar">
                <input
                    value={this.state.value}
                    placeholder="Search..."
                    onChange={evt => {
                        this.setState({value: evt.target.value})
                    }}
                    onKeyPress={evt => {
                        if (evt.key === 'Enter') {
                            const word = this.state.value.trim();
                            if (word !== decodeURIComponent(this.router.params.keyword)) {
                                this.router.push('/search/' + encodeURIComponent(word));
                            }
                        }
                    }}
                />
            </div>
        )
    }
}
