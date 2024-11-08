const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    port: 3000 // Замените 3000 на нужный вам порт
  },
};
