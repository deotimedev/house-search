<script lang="ts">
    import {model} from "@house-search/utils"
    import ReplyingTo from "$lib/components/ReplyingTo.svelte";

    export let entry: model.Entry
    export let isReplying = true // todo remove this!!
    $: character = entry.character.trim()
</script>

<div>
    <!--    TODO fetch the actual message this entry is replying to here-->
    {#if isReplying}
        <ReplyingTo entry={entry}/>
    {/if}

    <div class="flex items-center bg-white w-[60vw] rounded-2xl pt-1 pb-1">
        <div class="pl-5 flex flex-col items-center bg-white rounded-2xl">
            <p class="font-bold">{character.toUpperCase()}</p>
            <img alt={character} src="/characters/{character.toLowerCase()}.png" class="rounded-full max-h-[70px]"/>
            <p>S{entry.ep.season} E{entry.ep.number}</p>
        </div>
        <p class="pl-5 text-2xl flex-1">"{entry.text.replace(`${entry.character}:`, "")}"</p>
    </div>
</div>