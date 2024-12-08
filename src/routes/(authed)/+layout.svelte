<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();
	let activePage = $derived($page.url.pathname);
</script>

<nav class="navigation">
	<a href="/todo" class="nav-link {activePage.startsWith('/todo') ? 'active' : ''}">TODO</a>
	<a href="/factories" class="nav-link {activePage.startsWith('/factories') ? 'active' : ''}"
		>Factories</a
	>
	<a
		href={activePage.startsWith('/edit/line') ? activePage : '/edit/line'}
		class="nav-link {activePage.startsWith('/edit/line') ? 'active' : ''}">Line</a
	>
	<a
		href={activePage.startsWith('/edit/delivery') ? activePage : '/edit/delivery'}
		class="nav-link {activePage.startsWith('/edit/delivery') ? 'active' : ''}">Delivery</a
	>
	<a href="/logout" class="nav-link">Log out</a>
</nav>
{@render children()}

<style>
	/* Navigation Styling */
	.navigation {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(14, 14, 14, 255);
		padding: 20px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	.nav-link {
		color: rgba(250, 149, 73, 255);
		text-decoration: none;
		font-size: 1.2rem;
		margin: 0 15px;
		transition:
			color 0.3s ease,
			transform 0.3s ease;
		position: relative;
	}

	.nav-link::after {
		content: '';
		display: block;
		width: 0;
		height: 2px;
		background: rgba(250, 149, 73, 255);
		transition: width 0.3s;
		position: absolute;
		bottom: -5px;
		left: 0;
	}

	.nav-link.active {
		color: white;
		font-weight: bold;
	}

	.nav-link.active::after {
		content: '';
		display: block;
		width: 100%;
		height: 2px;
		background: rgba(250, 149, 73, 255);
		position: absolute;
		bottom: -5px;
		left: 0;
	}

	.nav-link:hover::after {
		width: 100%;
	}

	.nav-link:hover {
		color: white;
		transform: translateY(-2px);
	}

	/* Responsive Navigation Styling */
	@media (max-width: 768px) {
		.navigation {
			flex-direction: column;
			padding: 10px;
		}

		.nav-link {
			margin: 10px 0;
		}
	}
</style>
