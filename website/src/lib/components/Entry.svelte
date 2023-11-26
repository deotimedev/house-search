<script lang="ts">
    import {model} from "@house-search/utils"
    export let entry: model.Entry
    $: character = entry.character.trim()
</script>

<div class="flex items-center bg-white w-3/5 h-[120px] rounded-2xl">
    <div class="pl-5 flex flex-col items-center bg-white h-[100%] rounded-2xl">
        <p>{character.toUpperCase()}</p>
        <img alt={character} src="/characters/{character.toLowerCase()}.png" class="rounded-full max-h-[75%]" />
    </div>
    <p class="pl-10 text-2xl">"{entry.text.replace(`${entry.character}:`, "")}"</p>
</div>