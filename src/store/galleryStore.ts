import {
	GetImageSetSummaries,
	GetObjectFilterCatagories,
	ImageSetSummary,
} from '@/graphql/generated'
import { acceptHMRUpdate, defineStore } from 'pinia'

type ImageSets = NonNullable<GetImageSetSummaries['getImageSetSummaries']['image_sets']>
export interface FilterSet {
	[key: string]: boolean
}
export const useGalleryStore = defineStore('gallery', {
	state: () => {
		const search = ref('')
		const view = ref<'classic' | 'fluid'>('fluid')
		const switchView = () => {
			view.value = view.value === 'classic' ? 'fluid' : 'classic'
		}
		const setView = (newView: 'classic' | 'fluid') => {
			view.value = newView
		}
		
		const views = ref<string[]>(['classic', 'fluid'])
		
		const filterCategories = ref<GetObjectFilterCatagories['getObjectFilterCatagories']>([])
		
		const filter = ref<FilterSet>({})
		
		const setFilter = (key: keyof FilterSet, value: boolean) => {
			filter.value = { ...filter.value, [key]: value }
		}
		
		const resetFilter = () => {
			Object.keys(filter.value).forEach((key) => {
				filter.value[key] = false
			})
		}
		
		const filterPanel = ref<boolean>(false)
		
		const switchFilterPanel = () => {
			filterPanel.value = !filterPanel.value
		}
		
		const filterCount = ref<number>(0)
		
		watch(
			filter,
			(newFilter) => {
				const count = Object.values(newFilter).filter((val) => val === true).length
				filterCount.value = count
			},
			{ deep: true },
		)
		
		const deleteSetTimer = ref<Date | undefined>()
		
		const setDeleteSetTimer = (minutes: number = 60) => {
			const exp: Date = new Date()
			exp.setTime(exp.getTime() + minutes * 60000)
			deleteSetTimer.value = exp
		}
		
		const imageSets = ref<ImageSets>([])
		const setImageSets = (val: ImageSets): void => {
			imageSets.value = val
		}
		
		const filterIds = computed((): string[] => {
			const filterSelection =
				filterCategories.value?.filter((item) => {
					const keys = Object.keys(filter.value)
					return keys.some((key) => filter.value[key] && key === item?.id)
				}) ?? []
			
			return filterSelection?.map((item) => item?.id ?? '')
		})
		
		const addImageSet = (imageSet: ImageSetSummary) => {
			setImageSets([imageSet, ...imageSets.value])
		}
		
		const removeImageSet = (imageSetId: string) => {
			setImageSets(imageSets.value.filter((set) => set?.set_id !== imageSetId))
		}
		
		return {
			imageSets,
			setImageSets,
			search,
			view,
			switchView,
			setView,
			views,
			filter,
			filterCount,
			setFilter,
			resetFilter,
			filterPanel,
			switchFilterPanel,
			deleteSetTimer,
			setDeleteSetTimer,
			filterCategories,
			filterIds,
			addImageSet,
			removeImageSet,
		}
	},
	persist: [
		{
			paths: ['view', 'filter', 'filterCount', 'imageSets'],
			storage: localStorage,
		},
		{
			paths: ['deleteSetTimer'],
			storage: sessionStorage,
		},
	],
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useGalleryStore, import.meta.hot))
}
