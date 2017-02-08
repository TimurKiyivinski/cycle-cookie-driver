import xs from 'xstream'
import Cookies from 'js-cookie'

function CookieWrapper () {
  const callbacks = {}

  this.action = (category, action, params) => {
    const data = Cookies[action](...params)
    const callback = callbacks[category]
    if (callback) {
      callback(data)
    }
  }

  this.on = (category, callback) => {
    callbacks[category] = callback
  }
}

export function makeCookieDriver () {
  const cookieWrapper = new CookieWrapper()

  function cookieDriver (outgoing$) {
    outgoing$.addListener({
      next: outgoing => {
        cookieWrapper.action(outgoing.category, outgoing.action, outgoing.params)
      },
      error: () => {
      },
      complete: () => {
      }
    })

    return {
      select: category => xs.create({
        start: listener => {
          cookieWrapper.on(category, data => listener.next(data))
        },
        stop: () => {
        }
      })
    }
  }

  return cookieDriver
}
