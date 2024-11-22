<script>
	import { page } from '$app/stores';
</script>

<h1>ERROR: {$page.url}</h1>
<h2>{$page.status}: {$page.error.message}</h2>
