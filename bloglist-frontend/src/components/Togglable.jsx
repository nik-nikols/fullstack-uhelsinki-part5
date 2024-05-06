import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

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

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    );
});

Togglable.displayName = 'Togglable';

Togglable.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired,
    buttonLabel: PropTypes.string.isRequired
};

export default Togglable;