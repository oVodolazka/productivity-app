const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        historyApiFallback: true
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader','less-loader'],
            },
            {
                test:/\.hbs$/,
                use: ['handlebars-loader']
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
              },
        ],

    },

};

