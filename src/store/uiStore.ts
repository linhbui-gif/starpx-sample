import { nanoid } from 'nanoid'
import { defineStore, acceptHMRUpdate } from 'pinia'
export interface IToast extends IToastPayload {
	id: string
	timestamp: number
}

export interface IToastPayload {
	type: 'success' | 'error' | 'info'
	message: string
	link?: string
}

export const useUiStore = defineStore('ui', {
	state: () => {
		type ThemeType = 'white' | 'dark' | undefined
		
		const mobileMenuActive = ref(false)
		const toasts = ref<IToast[]>([])
		const theme = ref<ThemeType>('dark')
		
		const setMobileMenu = (isActive: boolean) => {
			mobileMenuActive.value = isActive
		}
		
		const addToast = (toast: IToastPayload) => {
			const id = nanoid()
			
			toasts.value.push({
				...toast,
				id,
				timestamp: new Date().getTime(),
			})
		}
		
		const removeToast = (id: string) => {
			toasts.value = toasts.value.filter((t) => t.id !== id)
		}
		
		const setTheme = (newTheme: ThemeType) => {
			theme.value = newTheme
		}
		
		return {
			toasts,
			mobileMenuActive,
			theme,
			setMobileMenu,
			addToast,
			removeToast,
			setTheme,
		}
	},
	persist: [
		{
			paths: ['theme'],
			storage: localStorage,
		},
	],
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
}
