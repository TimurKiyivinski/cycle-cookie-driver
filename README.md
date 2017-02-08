# cycle-cookie-driver
Cookie driver for Cycle.js that wraps around [js-cookie](https://github.com/js-cookie/js-cookie).

## installation
Install with NPM
```
npm install --save cycle-cookie-driver
```
Make sure to configure your build tool to compile the dependency from `node_modules/`. If you're using Webpack, your Babel loader entry might look like this:
```
{
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules\/(?!cycle-cookie-driver)/,
  query: {
    presets: ['es2015'],
    plugins: ['babel-plugin-transform-es2015-destructuring', 'babel-plugin-transform-object-rest-spread']
  }
}
```

## usage
Import into your ES6 code:
```
import { makeCookieDriver } from 'cycle-cookie-driver'
```
Register the driver:
```
const drivers = {
  ...
  cookie: makeCookieDriver()
}
```
Request format for `cookie` sink:
```
{
  category: 'getCounter',
  action: 'get',
  params: ['counter']
}
```
All requests wrap around `js-cookie` methods, hence `get, getJSON, set, remove` methods along with all arguments are supported.
Params are applied to the `Cookie` instance as so: 
```
const data = Cookies[action](...params)
```
The data received is passed to an optional callback, for example:
```
const getCounterCookie$ = sources.cookie.select('getCounter')
```

## sample
As there is no cookie `onchange` event from the browser, the only way to check for updates is to periodically poll a cookie.
```
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
