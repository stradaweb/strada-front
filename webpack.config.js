const path = require('path');

module.exports = {
  entry: {
    login: './public/assets/js/login.js'
  },
  output: {
    path: path.resolve(__dirname, 'public/assets/dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Matchea todos los archivos .js
        exclude: /node_modules/, // Excluye la carpeta node_modules
        use: {
          loader: 'babel-loader' // Usa babel-loader para transpilar el código
        }
      }
    ]
  }
};
