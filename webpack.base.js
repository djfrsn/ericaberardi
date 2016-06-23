const autoprefixer = require('autoprefixer');
const path = require('path');


module.exports = {
  entry: {
    main: './src/main.js',
    vendor: [
      'babel-polyfill',
      'classnames',
      'firebase',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-thunk'
    ]
  },

  output: {
    filename: '[name].js',
    path: path.resolve('./target'),
    publicPath: '/'
  },

  resolve: {
    alias: {
      test: path.resolve('./test'),
      firebaseconfig: process.env.NODE_ENV === 'development' ? '../dev-firebaseconfig.js' : '../prod-firebaseconfig.js'
    },
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'src'],
    root: path.resolve('./src')
  },

  postcss: [
    autoprefixer({ browsers: ['last 3 versions', 'Firefox ESR'] })
  ],

  sassLoader: {
    outputStyle: 'compressed',
    precision: 10,
    sourceComments: false
  }
};
