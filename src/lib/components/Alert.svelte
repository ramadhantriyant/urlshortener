<script lang="ts">
	type AlertType = "success" | "error";

	interface Props {
		message: string;
		type: AlertType;
	}

	let { message, type }: Props = $props();
</script>

<div
	class="mb-4 rounded p-3 {type === 'success'
		? 'bg-green-100 text-green-700'
		: 'bg-red-100 text-red-700'}"
>
	{message}
</div>
