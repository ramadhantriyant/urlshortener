<script lang="ts">
	type AlertType = "success" | "error";

	interface Props {
		message: string;
		type: AlertType;
	}

	let { message, type }: Props = $props();
</script>

<div
	class="flex items-start gap-3 rounded-lg border px-4 py-3 text-sm
		{type === 'success'
		? 'border-success/20 bg-success/10 text-success'
		: 'border-error/20 bg-error/10 text-error'}"
>
	{#if type === "success"}
		<svg class="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
		</svg>
	{:else}
		<svg class="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	{/if}
	<span>{message}</span>
</div>
