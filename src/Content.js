import React from 'react'

const Content = React.memo(({paragraph, charIndex, word}) => {
    console.log('render content')
  return (
    <div className="content">
    {paragraph.split('').map((char, index) => (
      <span key={index} className={`
        char ${charIndex === index ? 'active' : ''}
        ${
          word[index] === char
          ? 'correct'
          : index<charIndex ? 'incorrect' : ''
        }`}>{char}</span>
    ))}
  </div>
  )
})
export default Content
