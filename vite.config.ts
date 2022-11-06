import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//element plus 按需引入
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import visualizer from 'rollup-plugin-visualizer'
import postCssPxToRem from "postcss-pxtorem"
const { name }: Record<string, any> = require('./package.json')
const isProduction = process.env.NODE_ENV === 'production'
// const ONLINENAME = 'http://wgms.dev.fpi-inc.site'
const ONLINENAME = 'http://yhwszz.fpi-inc.site'
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            include: [
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                /\.vue$/,
                /\.vue\?vue/, // .vue
                /\.md$/ // .md
            ],
            resolvers: [
                ElementPlusResolver(),
                // 自动导入图标组件
                IconsResolver({
                    prefix: 'Icon',
                }),
            ],
            imports: ['vue', 'vue-router', 'pinia'],
            eslintrc: {
                enabled: false, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成
                filepath: './.eslintrc-auto-import.json', // 生成json文件
                globalsPropValue: true
            },
            // 声明文件生成位置和文件名称
            dts: './src/auto-import.d.ts'
        }),
        Components({
            resolvers: [
                // 自动注册图标组件
                IconsResolver({
                    enabledCollections: ['ep'],
                }),
                ElementPlusResolver()
            ]
        }),
        Icons({
            autoInstall: true,
        }),
        visualizer(),

    ],
    base: isProduction ? `/${name}/` : '/',
    build: {
        // 生成静态资源的存放路径
        assetsDir: 'static/img/',
        // 构建后是否生成 source map 文件
        sourcemap: !isProduction,
        // chunk 大小警告的限制
        chunkSizeWarningLimit: 1500,
        // 生产环境移除 console debugger
        minify: 'terser',
        terserOptions: {
            compress: {
                // drop_console: isProduction,
                drop_debugger: isProduction
            }
        },
        rollupOptions: {
            output: {
                chunkFileNames: 'static/js/[name]-[hash].js',
                entryFileNames: 'static/js/[name]-[hash].js',
                assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                // 解决打包时Some chunks are larger警告
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id
                            .toString()
                            .split('node_modules/')[1]
                            .split('/')[0]
                            .toString()
                    }
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': '/src/',
            '@components': '/src/components/',
            '@assets': '/src/assets/',
            '@utils': '/src/utils/',
            '@config': '/src/config/',
            '@styles': '/src/styles/',
            '@types': '/src/types/',
            '@static': '/public/static'
        }
    },
    server: {
        port: 3077,
        open: true,
        proxy: {
            '/api': {
                target: ONLINENAME,
                rewrite: path => path.replace(/^\/api/, ''),
                changeOrigin: true
            }
        }
    },
    css: {
        // 处理打包出现警告 "@charset" must be the first
        postcss: {
            plugins: [
                postCssPxToRem({
                    rootValue: 192, // 1rem的大小
                    propList: ['*', '!border*'],
                    selectorBlackList: ['.nearby-search-control']
                }),
                {
                    postcssPlugin: 'internal:charset-removal',
                    AtRule: {
                        charset: atRule => {
                            if (atRule.name === 'charset') {
                                atRule.remove()
                            }
                        }
                    }
                },
            ]
        },
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @use "./src/styles/mixins.scss" as *;
                    @use "./src/styles/el-reset.scss" as *;
                `,
                charset: false
            },
        }
    }
})
