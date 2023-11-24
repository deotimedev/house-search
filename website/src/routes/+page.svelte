<script lang="ts">
    import type {VectorizeInfo} from "./+page.server";
    import Title from "$lib/components/Title.svelte";
    import {fly} from "svelte/transition"
    import {onMount} from "svelte";
    import Search from "$lib/components/Search.svelte";

    // export let data: VectorizeInfo

    let ready = false
    onMount(() => ready = true)
</script>


{#if ready}
    <div transition:fly={{ y: 100, duration: 1000 }} class="flex flex-col items-center space-y-5 pt-52" style="height: 100%">
        <Title/>
        <Search/>
    </div>
{/if}