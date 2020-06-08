import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

const WinnerModal = props => {

    return ReactDOM.createPortal(
        <div onClick={props.onDismiss}
        className="ui dimmer modals visible active" style={{zIndex: '10'}}>
            <div onClick={(e) => e.stopPropagation()} className="ui standard modal visible active">
                <div className="header">
                    {props.title}
                </div>
                <div className="content">
                  {props.winner}
                </div>
                {/* <div className="content">
                    {props.content}
                </div> */}
                <div className="actions">
                    {props.actions}
                </div>
                {/* <Link to='/' className='item' style={{margin: '-5px 1px', color: '#00658F',transform: 'scaleY(-1)'}}>
                New Game
                </Link> */}
            </div>
        </div>,
        document.querySelector('#winnermodal')
    );

}

export default WinnerModal;