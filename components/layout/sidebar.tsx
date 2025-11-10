import { Sidebar } from '@deemlol/next-icons'
import Link from 'next/link'

const sidebarItems: { name: string; href: string }[] = [
	{ name: 'Home', href: '/' },
	{ name: 'News', href: '/news' },
	{ name: 'Strava', href: '/strava' },
	{ name: 'Chat', href: '/chat' },
	{ name: 'Room', href: '/room' },
]

export function SideBar() {
	return (
		<aside className="w-64 h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 flex flex-col">
			<div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
				<Link
					href="/"
					className="flex items-center gap-2 justify-between"
				>
					<span className="text-xl font-bold">Test App</span>
				</Link>
				<Sidebar size={24} color="#FFFFFF" />
			</div>
			<nav className="flex-1 p-4 space-y-2">
				{sidebarItems.map((item) => (
					<Link
						key={item.name}
						href={item.href}
						className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
					>
						<span>{item.name}</span>
					</Link>
				))}
			</nav>
		</aside>
	)
}
