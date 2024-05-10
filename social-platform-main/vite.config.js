import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 9000,
    proxy: {
      // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
      // 正则表达式写法
      "^/cor": {
        target: "http://127.0.0.1:8080", // 后端服务实际地址
        changeOrigin: true, //开启代理
        configure: (proxy, options) => {
          // 解决请求403问题：invalid CORS request
          proxy.on("proxyReq", function (proxyReq, req, res) {
            proxyReq.removeHeader("referer"); // 移除请求头
            proxyReq.removeHeader("origin"); // 移除请求头
          });
        },
        // path是请求方法axios配置的baseUr中去除 协议+域名+端口 剩下的部分。例如http://127.0.0.1:9000/api，这里的path就是/api
        rewrite: (path) => path.replace(/^\/cor/, ""), // 路径重写
      },
    },
  },
});
