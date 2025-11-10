interface ChipButtonProps {
	text: string
	onClick?: () => void
}

export default function ChipButton({ text, onClick }: ChipButtonProps) {
	return (
		<button
			className="bg-gray-200 text-gray-800 text-sm font-medium py-1 px-3 rounded-full hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-300"
			onClick={onClick}
		>
			{text}
		</button>
	)
}
