<script lang="ts">

    import {createEventDispatcher} from "svelte";

    let value = ""
    const dispatch = createEventDispatcher()
    const doSearch = () => dispatch("search", {
        query: value
    })
</script>

<div class="w-screen flex flex-row space-x-3 justify-center max-h-[5vh]">
    <input bind:value on:keydown={(e) => { if (e.key === "Enter") doSearch() }} id="search" name="q" type="search" placeholder="Enter query" class="rounded-2xl p-3 w-2/5" required>
    <button on:click={doSearch} class="flex justify-center items-center bg-blue-600 bg-blend-color rounded-2xl w-[10%] transition duration-300 ease-in-out hover:bg-blue-400 active:bg-blue-300">
        <img class="max-h-[50%]" alt="Search" src="/search.png" />
    </button>
</div>