# cycle-cookie-driver
Cookie driver for Cycle.js that wraps around [js-cookie](https://github.com/js-cookie/js-cookie).

## installation
Install with NPM
```bash
npm install --save cycle-cookie-driver
```

## usage
Import into your ES6 code:
```javascript
import { makeCookieDriver } from 'cycle-cookie-driver'
```
Register the driver:
```javascript
const drivers = {
  ...
  cookie: makeCookieDriver()
}
```
Request format for `cookie` sink:
```javascript
{
  category: 'getCounter',
  action: 'get',
  params: ['counter']
}
```
All requests wrap around `js-cookie` methods, hence `get, getJSON, set, remove` methods along with all arguments are supported.
Params are applied to the `Cookie` instance as so: 
```javascript
const data = Cookies[action](...params)
```
The data received is passed to an optional callback, for example:
```javascript
const getCounterCookie$ = sources.cookie.select('getCounter')
```

## sample
As there is no cookie `onchange` event from the browser, the only way to check for updates is to periodically poll a cookie.
```javascript
import xs from 'xstream'
import { div, p } from '@cycle/dom'

const HomeComponent = sources => {
  const getCounterCookie$ = sources.cookie.select('getCounter')

  const counterGetCookie$ = xs.periodic(5000).mapTo({
    category: 'getCounter',
    action: 'get',
    params: ['counter']
  })

  const counterSetCookie$ = xs.periodic(1000).map(count => ({
    category: 'setCounter',
    action: 'set',
    params: ['counter', count]
  }))

  const cookie$ = xs.merge(counterGetCookie$, counterSetCookie$)

  const vdom$ = getCounterCookie$.map(cookie => {
    return div([
      p(cookie)
    ])
  })

  return {
    DOM: vdom$,
    cookie: cookie$
  }
}

export default HomeComponent
```
