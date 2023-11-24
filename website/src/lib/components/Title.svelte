<script lang="ts">
    import {fly} from "svelte/transition"
    import {onMount} from "svelte";

    let ready = false

    onMount(() => ready = true)
</script>

{#if ready}
    <h1 transition:fly={{ y: 200, duration: 1000 }} class="py-10 text-white text-6xl text-center font-house">
        House Search
    </h1>
{/if}