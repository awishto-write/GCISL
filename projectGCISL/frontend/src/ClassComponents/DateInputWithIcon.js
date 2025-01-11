import React from 'react';

const DateInputWithIcon = React.forwardRef(({ value, onClick }, ref) => (
  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
    <input
      type="text"
      value={value}
      onClick={onClick}
      ref={ref}
      placeholder="Pick a due date    " // Updated placeholder
      style={{
        width: '100%',
        padding: '0.5rem',
        margin: '0.2rem 0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#e7f5ff', // Light blue background
        color: 'black',
        textAlign: 'center',
      }}
      readOnly // Prevent manual typing
    />
    <span
      onClick={onClick}
      style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        color: '#666',
        fontSize: '1.2em',
      }}
    >
      📅
    </span>
  </div>
));

export default DateInputWithIcon;