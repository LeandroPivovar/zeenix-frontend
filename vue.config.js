const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  parallel: false, // Desabilita thread-loader para evitar problemas com arquivos grandes
  chainWebpack: config => {
    // Remover thread-loader completamente
    const jsRule = config.module.rule('js')
    jsRule.uses.delete('thread-loader')
  },
  configureWebpack: {
    optimization: {
      minimize: true
    }
  }
})
