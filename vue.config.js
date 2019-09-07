module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:7878/',
                changeOrigin: true,
                ws: false,
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    }
}