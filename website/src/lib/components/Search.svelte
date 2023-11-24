<script lang="ts">

    import {createEventDispatcher} from "svelte";

    let value = ""
    const dispatch = createEventDispatcher()
    const doSearch = () => dispatch("search", {
        query: value
    })
</script>

<div class="w-screen flex flex-row space-x-3 justify-center">
    <input bind:value on:keydown={(e) => { if (e.key === "Enter") doSearch() }} id="search" name="q" type="search" placeholder="Enter query" class="rounded-2xl p-3 w-2/5" required>
    <button on:click={doSearch} class="bg-blue-600 bg-blend-color w-[10%] rounded-2xl text-xl text-blue-100 transition duration-300 ease-in-out hover:bg-blue-400 active:bg-blue-300">Search</button>
</div>