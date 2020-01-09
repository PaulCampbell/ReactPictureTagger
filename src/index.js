import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './index.css'

const Tagger = ({
  imageSrc,
  imageAlt,
  tags
}) => {
  const tagColors = [
     '#20629B', '#F6D55C', '#3CAEA3', '#ED553B', '#173f5f',
  ]

  return ReactDOM.createPortal(
    <React.Fragment>
      <div className="react-picture-tagger">
        <div className="picture-container">
          <img src={imageSrc} alt={imageAlt} />
          {
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
          }
        </div>
      </div>
    </React.Fragment>, document.body,
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
