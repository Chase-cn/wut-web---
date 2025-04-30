const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: 'localhost', // 仅绑定到 localhost
    port: 8081, // 指定端口（可选）
    /**
     * 注意单单使用代理无法解决跨域问题, 重要的是请求的url要改成同域的
     */
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 你的Spring Boot后端地址
        changeOrigin: true,
        /**
         * 移除路径中的/api前缀,区分代理的时候用,然而现在所有请求都需要代理,
         * 且所有API都有api字样,故不用移除了
         * */
        // pathRewrite: {
        //   '^/api': ''
        // }
        ws: true // 代理websockets
      }

    }
  }
})
