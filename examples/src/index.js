import React from 'react'
import { render } from 'react-dom'

import PictureTagger, { usePictureTagger } from '../../src'
import GithubRibbon from './GithubRibbon'

const App = () => {
    const [examplePictureTagger] = usePictureTagger({
      imageSrc: './muppets.png',
      imgAlt: 'muppets',
      tags: [
        { topLeft: [220, 57], bottomRight:[170, 1], name: 'Kermit' },
        { topLeft: [20, 37], bottomRight:[380, 1], name: 'Gonzo' },
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
