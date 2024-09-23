export type ImageSizeType = 'large' | 'medium' | 'small' | 'xlarge' | 'full'

export const ImageSizeTypes: Record<ImageSizeType, ImageSizeType> = {
	large: 'large',
	medium: 'medium',
	small: 'small',
	xlarge: 'xlarge',
	full: 'full',
}

export function getImageSize(width: number): ImageSizeType {
	const sortedThumbs = Object.entries(thumbs).sort((a, b) => b[1][0] - a[1][0])
	
	for (const [key, size] of sortedThumbs) {
		if (width >= size[0]) {
			return key as ImageSizeType
		}
	}
	
	return ImageSizeTypes.full
}