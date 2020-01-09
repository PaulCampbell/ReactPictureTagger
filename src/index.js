import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faPlus } from '@fortawesome/free-solid-svg-icons'
import './index.css'

const Tagger = ({
  imageSrc,
  imageAlt,
  tags
}) => {
  const [tagsVisible, setTagsVisible] = useState(false)
  const [addTagMode, setAddTagMode] = useState(false)
  const [imageWidth, setImageWidth] = useState(null)
  const [resizeRatio, setResizeRatio] = useState(1)
  const [rect, setRect] = useState({})
  const [drag, setDrag] = useState(false)

  const canvasRef = useRef(null)

  const image = new Image()
  image.src = imageSrc
  const tagColors = [
     '#20629B', '#F6D55C', '#3CAEA3', '#ED553B', '#173f5f',
  ]

  function toggleTags() {
    setTagsVisible(!tagsVisible)
  }

  function toggleAddTagMode() {
    if(!addTagMode) {
      setTagsVisible(false)
    }
    setAddTagMode(!addTagMode)
  }

  function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
  }
  HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;


  function drawImageOnCanvas() {
    image.onload = () => {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      const imageAspectRatio = image.height / image.width
      canvas.height = canvas.width * imageAspectRatio;
      setImageWidth(image.width)
      setResizeRatio(canvas.scrollWidth / image.width)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
    }
  }

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
    setDrag(false)
    // setNewTag({
    //   left: startX > finishX ? finishX : startX,
    //   top: startY > finishY ? finishY : startY,
    //   width: tag.width * resizeRatio,
    //   height: tag.height * resizeRatio,
    //   name: ''
    // })
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

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    drawImageOnCanvas()
    setupCanvasEventListeners()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      removeCanvasEventListeners()
    }
  })

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
            tags.map((tag, index) => {
              const tagStyle = {
                left: tag.left * resizeRatio,
                top: tag.top * resizeRatio,
                width: tag.width * resizeRatio,
                height: tag.height * resizeRatio,
                borderColor: tagColors[index],
                cursor: addTagMode ? '' : 'pointer'
              }
              const tagNameStyle = {
                "background-color": tagColors[index]
              }
              return <div className="reactPictureTagger-tag" style={ tagStyle } >
                <span className="reactPictureTagger-tagName" style={ tagNameStyle }>{tag.name}</span>
              </div>
            })
          : null }
        </div>
      </div>
  )
}

const ReactPictureTagger = () => {}
ReactPictureTagger.Tagger = Tagger
export default ReactPictureTagger

export const usePictureTagger = ({imageSrc, imageAlt, tags}) => {
  return [
    {
      imageSrc,
      imageAlt,
      tags
    }
  ]
}
