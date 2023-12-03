<script lang="ts">
    import type { model } from "@house-search/utils";
    import CharacterIcon from "./CharacterIcon.svelte";
    import characters from "$lib/characters";

    export let entry: model.Entry;
    let expanded = false;

    let textElement: HTMLParagraphElement;
    let divWidth: number;

    $: overflowing = divWidth && textElement && textElement.scrollHeight > textElement.clientHeight;
    $: character = characters.format(entry.character);
    $: text = entry.text.replace(`${entry.character}:`, "").trim();
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
            <div
                bind:offsetWidth={divWidth}
                class="pl-2 flex flex-row items-center bg-white rounded-2xl"
            >
                <div class="h-[max(1.5vw,15px)]">
                    <CharacterIcon {character} class="h-[100%]" />
                </div>
                <p class="pl-1 font-bold text-[max(8px,0.8vw)]">
                    {character.toUpperCase()}:
                </p>
            </div>
            <p
                bind:this={textElement}
                class="{!expanded
                    ? `line-clamp-1`
                    : ``} text-[max(8px,1vw)] pl-[1vw] pr-2 flex-1"
            >
                "{text}"
            </p>
        </div>

        {#if overflowing}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span
                title="Click to expand"
                class="pr-[1vw] pt-[0.3vw] cursor-pointer select-none"
                on:click={() => (expanded = !expanded)}
            >
                <img
                    alt="Expand"
                    src="/expand.png"
                    class="w-[max(1vw,15px)]"
                    style="transform: rotateZ({!expanded ? 90 : 0}deg)"
                />
            </span>
        {/if}
    </div>
</div>
