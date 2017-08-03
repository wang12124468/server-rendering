import React from 'react';

class Test extends React.Component {
    handleClick() {
        console.log('点击');
    }
    render() {
        return (
            <div>
                <div onClick={this.handleClick}>111111111111111222</div>
            </div>
        )
    }
}
export default Test;