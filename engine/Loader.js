//self-calling function
; (function () {

  class Loader {
    constructor() {
      this.loadeOrder = {
        images: [],
        jsons: []
      }

      this.resources = {
        images: [],
        jsons: []
      }
    }
    addImage(name, src) {
      this.loadeOrder.images.push({ name, src })
    }
    addJson(name, address) {
      this.loadeOrder.jsons.push({ name, address })
    }


    load(callback) {
      const promises = []

      for (const imageData of this.loadeOrder.images) {
        const { name, src } = imageData
        const promise = Loader
          .loadImage(src)
          .then(image => {
            this.resources.images[name] = image

            if (this.loadeOrder.images.includes(name)) {
              const index = this.loadeOrder.images.indexOf(name)
              this.loadeOrder.images.splice(index, 1)
            }
          })
        promises.push(promise)
      }
      for (const jsonData of this.loadeOrder.jsons) {
        const { name, address } = jsonData
        const promise = Loader
          .loadJson(address)
          .then(image => {
            this.resources.jsons[name] = image

            if (this.loadeOrder.jsons.includes(name)) {
              const index = this.loadeOrder.jsons.indexOf(name)
              this.loadeOrder.jsons.splice(index, 1)
            }
          })
        promises.push(promise)
      }
      Promise.all(promises).then(() => callback())
    }

    static loadImage(src) {
      return new Promise((resolve, reject) => {
        try {
          const image = new Image
          image.onload = () => resolve(image)
          image.src = src

        }
        catch (err) {
          reject(err)
        }
      })
    }
    static loadJson(address) {
      return new Promise((resolve, reject) => {
        fetch(address)
          .then(result => result.json())
          .then(result => resolve(result))
          .catch(err => reject(err))
      })
    }
  }

  window.GameEngine = window.GameEngine || {}
  window.GameEngine.Loader = Loader

})();