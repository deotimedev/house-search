<script lang="ts">
    import ReplyingTo from "$lib/components/ReplyingTo.svelte";
    import type { ScoredEntry } from "../../routes/search/SearchResults";
    import CharacterIcon from "./CharacterIcon.svelte";
    import characters from "$lib/characters";

    export let entry: ScoredEntry;
    $: character = characters.format(entry.character);
    $: text = entry.text.replace(`${entry.character}:`, "").trim();
</script>

<div class="w-[60vw] min-w-[300px] max-w-[95vw]">
    {#if entry.replyingTo}
        <ReplyingTo entry={entry.replyingTo} />
    {/if}

    <div id="textbox" class="flex items-center bg-white rounded-2xl pt-1 pb-1">
        <div
            class="pl-[1vw] flex flex-col items-center bg-white rounded-2xl min-w-[50px]"
        >
            <p class="font-bold text-[max(8px,1vw)]">
                {character.toUpperCase()}
            </p>
            <CharacterIcon
                {character}
                class="h-[3.5vw] min-w-[40px] min-h-[40px]"
            />
            <p class="text-[max(8px,1vw)]">
                S{entry.ep.season} E{entry.ep.number}
            </p>
        </div>
        <p class="pl-[1vw] flex-1 text-[max(12px,1.5vw)]">"{text}"</p>
    </div>
</div>
