import mediumProgress from 'medium-image-progressive'



export default function (opt = {}) {

  return function (pageData) {
    const callbackCollect = this.callbackCollect
    callbackCollect(function (ele) {
      mediumProgress('img[data-progressive-src]', {
        // progressImageUrlGetter: ele => ele.
      })
    })
  }
}
