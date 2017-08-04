# spotqueue-server

Server for  radio stations to listen together even when afar.

Built using React Native, Redux, NodeJS, Express, MongoDB, Mongoose, Facebook SDK, Spotify API, Node-Cron, WebSockets

## Contributing
### Clone repositories
    git clone https://github.com/dyang108/spotqueue.git
    git clone https://github.com/dyang108/spotqueue-server.git
### Install dependencies in both directories
    npm install
### Start the database
    mongod
### Run server
    nodemon index.js
### Start app with environment variables
    API_URL='http://localhost:8000' npm start

* You might need to install the facebook sdk [here](https://developers.facebook.com/docs/ios/getting-started/). Make sure you put it in ~/Documents/FacebookSDK *

This project follows [standard](https://github.com/feross/standard) style.

## Best Practices
* break up styles file
* use style constants (**TODO**)
* redux
  * presentational components do *not* `connect()`
  * do not use `subscribe()` directly
* models separate from apis on server side
* only use one ID for documents in the database

## Good React/Redux resources:
* [Organizing React Native project](https://medium.com/the-react-native-log/organizing-a-react-native-project-9514dfadaa0)
* [Why to not use `subscribe`](https://github.com/reactjs/redux/issues/303#issuecomment-125184409)
* [Why to not use `subscribe` again](http://stackoverflow.com/questions/36212860/subscribe-to-single-property-change-in-store-in-redux)
* [Basic intro to Redux](https://css-tricks.com/learning-react-redux/)
* [React `createClass()` versus `extends Component`](https://toddmotto.com/react-create-class-versus-component/)
* [Two types of React components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
* [React component lifecycle](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle)
* [Facebook login SDK and usage](https://github.com/facebook/react-native-fbsdk#usage)
