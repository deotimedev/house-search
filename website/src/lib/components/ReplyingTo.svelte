<script lang="ts">
    import {model} from "@house-search/utils"
    import Entry from "$lib/components/Entry.svelte";
    export let entry: model.Entry
    $: character = entry.character.trim()

    const responseText = "blah blah blah asdf asdfasdf asdfererwewre weqrewrewqrqwerdsafsafddfafdsfsddfsdfasfdsdf"
    let expanded = false
</script>

{#if expanded}
    <div class="mb-1">
        <Entry entry={{
            text: responseText,
            character: "house",
            ep: {
                season: 5,
                number: 3
            }
        }} />
    </div>
{:else}
    <div title="Click to expand" on:click={() => expanded = !expanded} class="flex items-center ml-5 cursor-pointer">
        <img alt="reply" src="/reply.png" class="max-h-[30px]" style="transform: scaleX(-1); filter: invert(100%)" />
        <div class="ml-2 inline-flex items-center bg-white rounded-xl pt-1 pb-1 mb-2">
            <div class="pl-2 flex flex-row items-center bg-white rounded-2xl">
                <img alt={character} src="/characters/{character.toLowerCase()}.png" class="rounded-full max-h-[30px]" />
                <p class="pl-1 font-bold">{character.toUpperCase()}:</p>
            </div>
            <p class="pl-2 pr-2 flex-1">"{responseText}"</p>
        </div>
    </div>
{/if}