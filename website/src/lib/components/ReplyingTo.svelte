<script lang="ts">
    import {model} from "@house-search/utils"
    import Entry from "$lib/components/Entry.svelte";
    export let entry: model.Entry
    let expanded = false
    let screenWidth = window.innerWidth

    $: character = entry.character.trim()
    $: text = (() => {
        const chars = screenWidth / 25
        const text = entry.text.replace(`${entry.character}:`, "").trim()
        return expanded || chars >= text.length ? text : `${text.slice(0, chars)}...`
    })()
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div title="Click to expand" on:mouseover={() => expanded = true} on:mouseout={() => expanded = false} class="flex items-center ml-5 cursor-pointer">
    <img alt="reply" src="/reply.png" class="max-h-[30px]" style="transform: scaleX(-1); filter: invert(100%)" />
    <div class="ml-2 inline-flex items-center bg-white rounded-xl pt-1 pb-1 mb-2">
        <div class="pl-2 flex flex-row items-center bg-white rounded-2xl">
            <img alt={character} src="/characters/{character.toLowerCase()}.png" class="rounded-full max-h-[1.5vw]" />
            <p class="pl-1 text-[0.8vw] font-bold">{character.toUpperCase()}:</p>
        </div>
        <p class="shrink pl-2 pr-2 text-[1vw] flex-1">"{text}"</p>
    </div>
</div>