import React, { useState } from 'react'
import { render } from 'react-dom'

import PictureTagger, { usePictureTagger } from '../../src'
import GithubRibbon from './GithubRibbon'

const pictures = [
  {
    imageSrc: './images/muppets.png',
    imgAlt: 'Image 1',
    tags: [
      { top: 128, left: 5, width: 180, height: 190, name: 'Rizzo' },
      { top: 8, left: 180, width: 500, height:410, name: 'Gonzo' },
    ]
  },
  {
    imageSrc: './images/muppets2.jpg',
    imgAlt: 'Image 2',
    tags: [
      { top: 78, left: 80, width: 180, height: 190, name: 'Gonzo' },
      { top: 8, left: 180, width: 500, height:410, name: 'Gonzo' },
    ]
  }
]

const App = () => {
  const [activePicture, setActivePicture] = useState(pictures[0])

  function changeImage(ev) {
    const {value} = ev.target
    setActivePicture(pictures[value])
  }

  return (
      <div>
        <div style={{color: '#666', textAlign: 'center', padding: '30px 0'}}>
          <GithubRibbon />
          <h1>React Picture Tagger</h1>
        </div>
        <div style={{ padding: '6px', maxWidth:"780px", margin: "auto" }}>
          <label style={{paddingRight: '6px'}} htmlFor="selectedImage">Select Image</label>
          <select name="selectedImage" id="selectedImage" onChange={changeImage}>
            { pictures.map((picture, index) => {
              return <option value={index}>
                {picture.imgAlt}
              </option>
            })
            }
          </select>
          <PictureTagger.Tagger {...activePicture} />
        </div>
      </div>
    )
}

render(<App />, document.getElementById('root'))
