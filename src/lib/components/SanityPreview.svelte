<script>
	import { PreviewMode, QueryLoader, VisualEditing } from '@sanity/sveltekit';

	/** @type {{ client: import('@sanity/client').SanityClient, enabled: boolean, children: import('svelte').Snippet }} */
	const { client, enabled, children } = $props();
</script>

<PreviewMode {enabled}>
	<VisualEditing {enabled}>
		<QueryLoader {enabled} {client}>
			{@render children()}
		</QueryLoader>
	</VisualEditing>
</PreviewMode>
