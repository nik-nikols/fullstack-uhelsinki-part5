import { useState, forwardRef, useImperativeHandle } from 'react';

const Togglable = forwardRef( (props, refs) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(refs, () => {
        return { toggleVisibility };
    });

    const showWhenVisible = { display: visible ? '' : 'none'};
    const hideWhenVisible = { display: visible ? 'none' : ''};

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    const CancelButton = ({ hideCancel }) => {
        console.log('hideCancel: ', hideCancel);
        if (hideCancel){
            return null;
        } 
        else {
            return(
                <button onClick={toggleVisibility}>cancel</button>
            );
        }
    };

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <CancelButton hideCancel={props.hideCancel}/>
            </div>
        </div>
    );
});

export default Togglable;