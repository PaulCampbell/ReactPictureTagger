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
  const canvasRef = useRef(null)

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

  function drawImageOnCanvas() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      const imageAspectRatio = image.height / image.width
      canvas.height = canvas.width * imageAspectRatio;
      setImageWidth(image.width)
      setResizeRatio(canvas.scrollWidth / image.width)
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    }
  }

  function handleResize() {
    const canvas = canvasRef.current
    const newRatio = canvas.scrollWidth / imageWidth
    setResizeRatio(newRatio)
  }

  useEffect(() => {
    drawImageOnCanvas()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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
          <canvas ref={canvasRef}>
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
