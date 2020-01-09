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

  const tagColors = [
     '#20629B', '#F6D55C', '#3CAEA3', '#ED553B', '#173f5f',
  ]

  function toggleTags() {
    setTagsVisible(!tagsVisible)
  }

  function startAddTagMode() {
    setTagsVisible(true)
    setAddTagMode(true)
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
          <a onClick={startAddTagMode} title="Add tag">
            <FontAwesomeIcon icon={faPlus} />
          </a>
        </div>
        <div className="reactPictureTagger-pictureContainer">
          <img src={imageSrc} alt={imageAlt} />
          { tagsVisible ?
            tags.map((tag, index) => {
              const tagStyle = {
                left: tag.topLeft[0],
                top: tag.topLeft[1],
                right: tag.bottomRight[0],
                bottom: tag.bottomRight[1],
                borderColor: tagColors[index]
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
