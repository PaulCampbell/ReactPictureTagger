# ReactPictureTagger

It's a react component for taggin pictures...

![example screen grab](./demo_gif.gif "Screen Grab")

## Try it out

https://paulcampbell.github.io/ReactPictureTagger/

## How to use it

You can check the [example](https://github.com/PaulCampbell/ReactPictureTagger/blob/master/examples/src/index.js).

Basically something like this:

```
import ReactPictureTagger from '../../src'

const App = () => {
  const picture = {
    imageSrc: './images/muppets.png',
    imgAlt: 'Image 1',
    tags: [
      { top: 128, left: 5, width: 180, height: 190, name: 'Rizzo' },
    ]
  }

  function tagsUpdated(newTags) {
    console.log(newTags)
  }

  return (
    <PictureTagger.Tagger
      imageSrc={activePicture.imageSrc}
      imageAlt={activePicture.imageAlt}
      tags={picture}
      showTags={true}
      tagsUpdated={tagsUpdated}
      />
  )
}
```
