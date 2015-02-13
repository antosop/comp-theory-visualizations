module.exports = {
	//configuration
	entry: {
		main: "./content/scripts/main.js",
		d3: "./node_modules/d3/d3.js"
	},
	output: {
		path: __dirname + "/dist",
		filename: "[name].bundle.js"
	},
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: '6to5-loader' }
        ]
    }
};
