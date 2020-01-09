import React from 'react'
import { render } from 'react-dom'

import PictureTagger, { usePictureTagger } from '../../src'
import GithubRibbon from './GithubRibbon'

const App = () => {
    const [examplePictureTagger] = usePictureTagger({
      imageSrc: './muppets.png',
      imgAlt: 'muppets',
      tags: [
        { top: 128, left: 5, width: 180, height: 190, name: 'Rizzo' },
        { top: 8, left: 180, width: 500, height:410, name: 'Gonzo' },
      ]
    })
    return (
          <React.Fragment>
            <div>
              <GithubRibbon />
              <h1>React Picture Tagger</h1>
            </div>
            <div>
              <PictureTagger.Tagger {...examplePictureTagger} />
            </div>
          </React.Fragment>
        )
}

render(<App />, document.getElementById('root'))
