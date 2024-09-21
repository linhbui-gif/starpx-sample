import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite'
// https://vitejs.dev/config/
export default defineConfig(() => {
	return {
		base: '/',
		plugins: [
			vue(),
			AutoImport({
				include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
				imports: [
					'vue',
					'vue-router',
					'pinia',
				],
				dirs: [
					'./src/hooks/*',
					'./src/store/*',
					'./src/utils/*',
					'./src/graphql/generated',
				],
				dts: true,
				eslintrc: {
					enabled: true,
				},
			}),
		],
		server: {
			port: Number(process.env.VITE_PORT) || 8888
		},
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
				'@public': fileURLToPath(new URL('./public', import.meta.url)),
			},
		},
		define: {
			global: {},
		},
	}
})
