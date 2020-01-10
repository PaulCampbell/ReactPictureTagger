import React, { useState } from 'react'
import { render } from 'react-dom'

import ReactPictureTagger from '../../src'
import GithubRibbon from './GithubRibbon'

const pictures = [
  {
    imageSrc: './static/muppets.png',
    imgAlt: 'Image 1',
    tags: [
      { top: 128, left: 5, width: 180, height: 190, name: 'Rizzo' },
      { top: 8, left: 180, width: 500, height:410, name: 'Gonzo' },
    ]
  },
  {
    imageSrc: './static/muppets2.jpg',
    imgAlt: 'Image 2',
    tags: [
      {"left":335,"top":69,"width":188,"height":218,"name":"kermit"},
      {"left":72,"top":41,"width":215,"height":206,"name":"gonzo"}
    ]
  }
]

const App = () => {
  const [activePicture, setActivePicture] = useState(pictures[0])

  function changeImage(ev) {
    const {value} = ev.target
    setActivePicture(pictures[value])
  }

  function tagsUpdated(tags) {
    setActivePicture(Object.assign({}, activePicture, {tags}))
  }

  return (
      <div style={{maxWidth:"780px", margin: "auto"}}>
        <div style={{color: '#666', padding: '30px 0'}}>
          <GithubRibbon />
          <h1 style={ {textAlign: 'center', marginBottom: '20px'}}>React Picture Tagger</h1>
          <div className="testimonial-quote group">
            <div className="quote-container">
                <blockquote>
                  <p>Here’s some simple advice: always be yourself. Never take yourself too seriously. And beware the advice from experts, pigs, and members of Parliament.</p>
                </blockquote>
                <cite>
                  <span>Kermit the Frog</span><br />
                  A frog
                </cite>
            </div>
          </div>
        </div>
        <div style={{ padding: '6px'  }}>
          <label style={{paddingRight: '6px'}} htmlFor="selectedImage">Select Image</label>
          <select name="selectedImage" id="selectedImage" onChange={changeImage}>
            { pictures.map((picture, index) => {
              return <option value={index}>
                {picture.imgAlt}
              </option>
            })
            }
          </select>
          <ReactPictureTagger
            imageSrc={activePicture.imageSrc}
            imageAlt={activePicture.imageAlt}
            tags={activePicture.tags}
            showTags={true}
            tagsUpdated={tagsUpdated}
            />
        </div>
        <div>
          <h2>Tags</h2>
          <ul>
          {
            activePicture.tags.map(tag => <li>{JSON.stringify(tag)}</li> )
          }
          </ul>
        </div>
      </div>
    )
}

render(<App />, document.getElementById('root'))
