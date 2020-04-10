module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8004/',
                changeOrigin: true,
                ws: false,
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    }
}