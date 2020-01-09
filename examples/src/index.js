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
            <GithubRibbon />
            <div className="container my-5">
              <div className="row mt-5">
                <div className="col-12 d-flex justify-content-center mt-5">
                  <PictureTagger.Tagger {...examplePictureTagger} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )
}

render(<App />, document.getElementById('root'))
