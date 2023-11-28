<script lang="ts">
    import ReplyingTo from "$lib/components/ReplyingTo.svelte";
    import type {ScoredEntry} from "../../routes/search/SearchResults";

    export let entry: ScoredEntry
    $: character = entry.character.trim()
    $: text = entry.text.replace(`${entry.character}:`, "").trim()
</script>

<div class="w-[60vw]">
    {#if entry.replyingTo}
        <ReplyingTo entry={entry.replyingTo}/>
    {/if}

    <div id="textbox" class="flex items-center bg-white rounded-2xl pt-1 pb-1">
        <div class="pl-5 flex flex-col items-center bg-white rounded-2xl">
            <p class="text-[1vw] font-bold">{character.toUpperCase()}</p>
            <img alt={character} src="/characters/{character.toLowerCase()}.png" class="rounded-full max-h-[3.5vw]"/>
            <p class="text-[1vw]">S{entry.ep.season} E{entry.ep.number}</p>
        </div>
        <p class="pl-5 text-[1.5vw] flex-1">"{text}"</p>
    </div>
</div>