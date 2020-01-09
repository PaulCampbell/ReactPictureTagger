import React, { useState, useEffect, useRef } from 'react'

const TagCreator = ({ newTag, clearTag, submitTag }) => {
  const [tag, setTag] = useState(newTag)
  const inputRef = useRef(null)

  function handleChangeTagName(e) {
    const { value } = e.target
    setTag(Object.assign(tag, {name: value}))
  }

  function handleSubmit(e) {
    if(e.keyCode == 13) {
      submitTag()
    }
    if(e.keyCode == 27) {
      clearTag()
    }
  }

  useEffect(() => {
    inputRef.current.focus()
  })

  return (
    <div className="reactPictureTagger-newTag"
         style={
           {
              left: tag.left,
              top: tag.top,
              width: tag.width,
              height: tag.height
           }
         }>
      <input
        id="name"
        className="reactPictureTagger-newTag-name"
        placeholder='Tag name'
        name="name"
        type="text"
        ref={inputRef}
        onChange={handleChangeTagName}
        onKeyDown={handleSubmit}
      />
    </div>
  )
}

export default TagCreator
