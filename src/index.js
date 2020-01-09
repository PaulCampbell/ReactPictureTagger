import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import './index.css'

const Tagger = ({
  imageSrc,
  imageAlt,
  tags
}) => {
  const [tagsVisible, setTagsVisible] = useState(false)

  const tagColors = [
     '#20629B', '#F6D55C', '#3CAEA3', '#ED553B', '#173f5f',
  ]

  function toggleTags() {
    setTagsVisible(!tagsVisible)
  }

  return (
      <div className="react-picture-tagger">
        <div className="tag-controls">
          <a onClick={toggleTags}>
            { tagsVisible ?
              <FontAwesomeIcon style={{color:"#666"}} icon={faEyeSlash} />
              : <FontAwesomeIcon style={{color:"#666"}} icon={faEye} />
            }
          </a>
        </div>
        <div className="picture-container">
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
              return <div className="tag" style={ tagStyle } >
                <span className="tag-name" style={ tagNameStyle }>{tag.name}</span>
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
