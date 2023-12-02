<script lang="ts">
    import type {model} from "@house-search/utils"
    import CharacterIcon from "./CharacterIcon.svelte";
    import characters from "$lib/characters";

    export let entry: model.Entry
    let expanded = false

    $: character = characters.format(entry.character)
    $: text = entry.text.replace(`${entry.character}:`, "").trim()
</script>

<div class="flex items-center ml-5">
    <img
            alt="reply"
            src="/reply.png"
            class="max-h-[30px]"
            style="transform: scaleX(-1); filter: invert(100%)"
    />
    <div class="ml-2 inline-flex bg-white rounded-xl pt-1 pb-1 mb-2">
        <div class="inline-flex items-center">
            <div class="pl-2 flex flex-row items-center bg-white rounded-2xl">
                <CharacterIcon {character} class="max-h-[1.5vw]" />
                <p class="pl-1 text-[0.8vw] font-bold">{character.toUpperCase()}:</p>
            </div>
            <p class="{!expanded ? `line-clamp-1` : ``} pl-2 pr-2 flex-1 overflow-hidden" style="font-size: max(8px, 1vw);">"{text}"</p>

        </div>
        
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span
                title="Click to expand"
                class="pr-[1vw] pt-[0.3vw] cursor-pointer select-none"
                on:click={() => expanded = !expanded}>
            <img
                    alt="Expand"
                    src="/expand.png"
                    class="max-h-[1vw]"
                    style="transform: rotateZ({!expanded ? 90 : 0}deg)"
            />
            </span>
    </div>

</div>