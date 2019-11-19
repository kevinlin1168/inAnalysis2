module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://140.112.26.132:8004/',
                changeOrigin: true,
                ws: false,
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    }
}