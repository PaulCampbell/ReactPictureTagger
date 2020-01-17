import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faPlus } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import TagCreator from './TagCreator'

const ReactPictureTagger = ({
  imageSrc,
  tags,
  showTags,
  tagsUpdated
}) => {
  const [allTags, setAllTags] = useState([...tags])
  useEffect(() => {
    setAllTags(tags)
  }, [tags])
  const [tagsVisible, setTagsVisible] = useState(showTags)
  const [addTagMode, setAddTagMode] = useState(false)
  const [imageWidth, setImageWidth] = useState(null)
  const [resizeRatio, setResizeRatio] = useState(1)
  const [rect, setRect] = useState({})
  const [drag, setDrag] = useState(false)
  const [editingTag, setEditingTag] = useState(null)

  const canvasRef = useRef(null)

  const image = new Image()
  image.src = imageSrc
  image.onload = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const imageAspectRatio = image.height / image.width
    canvas.height = canvas.width * imageAspectRatio
    setImageWidth(image.width)
    setResizeRatio(canvas.scrollWidth / image.width)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
  }
  const tagColors = [
     '#20629B', '#F6D55C', '#3CAEA3', '#ED553B', '#173f5f',
  ]

  function toggleTags() {
    if(addTagMode) {
      toggleAddTagMode()
    }
    setTagsVisible(!tagsVisible)
  }

  function toggleAddTagMode() {
    if(!addTagMode) {
      setTagsVisible(false)
      setEditingTag(null)
    }
    setAddTagMode(!addTagMode)
  }

  function editTag(tagIndex, tag) {
    if(!editingTag) {
      setEditingTag(Object.assign(tag, { index: tagIndex}))
      setTagsVisible(false)
    }
  }

  function relMouseCoords(event){
    var totalOffsetX = 0
    var totalOffsetY = 0
    var canvasX = 0
    var canvasY = 0
    var currentElement = this

    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX - window.scrollX
    canvasY = event.pageY - totalOffsetY - window.scrollY

    return {x:canvasX, y:canvasY}
  }
  HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords

  function setupCanvasEventListeners() {
    const canvas = canvasRef.current
    canvas.addEventListener('mousedown', mouseDown, false)
    canvas.addEventListener('mouseup', mouseUp, false)
    canvas.addEventListener('mousemove', mouseMove, false)
  }

  function removeCanvasEventListeners() {
    const canvas = canvasRef.current
    canvas.removeEventListener('mousedown', mouseDown)
    canvas.removeEventListener('mouseup', mouseUp)
    canvas.removeEventListener('mousemove', mouseMove)
  }

  function mouseDown(e) {
    if(addTagMode) {
      const canvas = canvasRef.current
      setRect(Object.assign(rect, {
        startX: canvas.relMouseCoords(e).x,
        startY: canvas.relMouseCoords(e).y,
        finishX: canvas.relMouseCoords(e).x,
        finishY: canvas.relMouseCoords(e).y,
      }))
      setDrag(true)
    }
  }

  function mouseUp() {
    if(drag) {
      setDrag(false)
      setEditingTag({
        index: null,
        left: Math.round((rect.startX > rect.finishX ? rect.finishX : rect.startX) / resizeRatio),
        top: Math.round((rect.startY > rect.finishY ? rect.finishY : rect.startY) / resizeRatio),
        width: Math.round((rect.startX > rect.finishX ? rect.startX - rect.finishX : rect.finishX - rect.startX) / resizeRatio),
        height: Math.round((rect.startY > rect.finishY ? rect.startY - rect.finishY : rect.finishY - rect.startY) / resizeRatio),
        name: ''
      })
      setAddTagMode(false)
    }
  }

  function mouseMove(e) {
    if (drag) {
      const canvas = canvasRef.current
      setRect(Object.assign(rect, {
        finishX: canvas.relMouseCoords(e).x,
        finishY: canvas.relMouseCoords(e).y
      }))
      draw()
    }
  }

  function draw() {
    if (drag) {
      const canvas = canvasRef.current
      const canvasRatio = canvas.width / canvas.offsetWidth
      const context = canvas.getContext('2d')
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      context.strokeStyle = 'red'
      context.lineWidth = 2
      context.strokeRect(
        rect.startX * canvasRatio,
        rect.startY * canvasRatio,
        (rect.finishX - rect.startX) * canvasRatio,
        (rect.finishY - rect.startY) * canvasRatio
      )
    }
  }

  function handleResize() {
    const canvas = canvasRef.current
    const newRatio = canvas.scrollWidth / imageWidth
    setResizeRatio(newRatio)
  }

  function handleEscape(e) {
    if(e.keyCode == 27 && addTagMode) {
      return toggleAddTagMode()
    }
  }

  useEffect(() => {
    setupCanvasEventListeners()
    window.addEventListener('resize', handleResize)
    document.addEventListener("keydown", handleEscape, false)
    return () => {
      window.removeEventListener('resize', handleResize)
      removeCanvasEventListeners()
      document.removeEventListener("keydown", handleEscape, false)
    }
  })

  function submitNewTag(newTag) {
    // wtf? So for some reason if we don't delay for a short while, setting the state does not
    // always cause a re-render... force a short wait
    new Promise(resolve => {
      setTimeout(() => {
        delete newTag.index
        const newTags = allTags.concat([newTag])
        setAllTags(newTags)
        tagsUpdated(newTags)
        setAddTagMode(false)
        setEditingTag(null)
        setTagsVisible(true)
        resolve()
      }, 100)
    })
  }

  function saveEditedTag(editedTag) {
    allTags[editingTag.index].name = editedTag.name
    setEditingTag(null)
    setAllTags(allTags)
    tagsUpdated(allTags)
    setTagsVisible(true)
  }

  function cancelEditedTag() {
    setEditingTag(null)
    setTagsVisible(true)
  }

  function deleteTag() {
    allTags.splice(editingTag.index, 1)
    setAllTags(allTags)
    tagsUpdated(allTags)
    setEditingTag(null)
    setTagsVisible(true)
  }

  return (
      <div className="reactPictureTagger" style={addTagMode ? { cursor: 'copy'} : null }>
        <div className="reactPictureTagger-tagControls">
          <a onClick={toggleTags} title={tagsVisible ? "Hide tags" : "Show tags"}>
            { tagsVisible ?
              <FontAwesomeIcon icon={faEyeSlash} />
              : <FontAwesomeIcon icon={faEye} />
            }
          </a>
          <a onClick={toggleAddTagMode} title="Add tag">
            <FontAwesomeIcon icon={faPlus} style={ addTagMode ? { color: "#721c24" } : null } />
          </a>
        </div>
        <div className="reactPictureTagger-pictureContainer">
          <canvas width={720} ref={canvasRef}>
          </canvas>
          { tagsVisible ?
            allTags.map((tag, index) => {
              const tagStyle = {
                left: tag.left * resizeRatio,
                top: tag.top * resizeRatio,
                width: tag.width * resizeRatio,
                height: tag.height * resizeRatio,
                borderColor: tagColors[index],
                cursor: addTagMode ? '' : 'pointer',
              }
              const tagNameStyle = {
                "backgroundColor": tagColors[index % tagColors.length]
              }
              return !editingTag ? <div onClick={() => editTag(index, tag)} key={`tag-${index}`} className="reactPictureTagger-tag" style={ tagStyle } >
                <span className="reactPictureTagger-tagName" style={ tagNameStyle }>{tag.name}</span>
              </div> : null
            })
          : null }

          { editingTag && editingTag.index != null ?
            <TagCreator
              tagToEdit={editingTag}
              cancelTag={cancelEditedTag}
              saveTag={saveEditedTag}
              deleteTag={deleteTag}
              resizeRatio={resizeRatio}
            />
          : null }

          { editingTag && editingTag.index === null ? <React.Fragment>
              <TagCreator
                tagToEdit={editingTag}
                cancelTag={cancelEditedTag}
                saveTag={submitNewTag}
                resizeRatio={resizeRatio}
              />
              <div className="reactPictureTagger-newTag-instructions">
                Press Enter key to save tag. Escape to cancel
              </div>
            </React.Fragment>
          : null }
        </div>
      </div>
  )
}

export default ReactPictureTagger
