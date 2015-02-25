module.exports = {
	//configuration
	entry: {
		main: ['expose?jQuery!jquery', 'bootstrap-webpack', './content/scripts/main.js'],
        //jquery: 'jquery',
        //bootstrap: 'bootstrap'
		//d3: "./node_modules/d3/d3.js"
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].bundle.js'
	},
    module: {
        loaders: [
			// Needed for the css-loader when [bootstrap-webpack](https://github.com/bline/bootstrap-webpack)
			// loads bootstrap's css.
			{ test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff" },
			{ test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/octet-stream" },
			{ test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
			{ test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=image/svg+xml" },
            { test: /\.js$/, exclude: /node_modules/, loader: '6to5!eslint' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.jsx$/, loader: 'jsx!6to5!eslint' }
        ]
    }
};
