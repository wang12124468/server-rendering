import React from 'react';
import { Link, IndexLink } from 'react-router';

class Common extends React.Component {
    render() {
        return (
            <div>
                <nav style={{margin: 10}}>
                    <IndexLink to="/" style={{marginRight: 8}}>App</IndexLink>
                    <Link to="/test">test</Link>
                </nav>
                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
export default Common;