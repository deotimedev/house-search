<script lang="ts">
    import Title from "$lib/components/Title.svelte";
    import {fly} from "svelte/transition"
    import {onMount} from "svelte";
    import Search from "$lib/components/Search.svelte";
    import {SyncLoader} from "svelte-loading-spinners"
    import Entry from "$lib/components/Entry.svelte";

    let ready = false
    onMount(() => ready = true)

    let results: Promise<unknown[]> | undefined
</script>


{#if ready}
    <div class="flex flex-col items-center space-y-5 pt-52" style="height: 100%">
        <div transition:fly={{ y: 100, duration: 1000 }}><Title/></div>
        <div transition:fly={{ y: 200, duration: 1000 }}>
            <Search on:search={(e) => {
                // TODO make query here
                const query = e.detail.query
                results = new Promise((resolve) => {
                    setTimeout(() => resolve([{}, {}, {}]), 1000)
                })
            }}/>
        </div>

        {#if results}
            {#await results}
                <SyncLoader size="60" color="#FFFFFF" unit="px" duration="0.5s"/>
            {:then results}
                {#each results as result}
                    <Entry />
                {/each}
            {/await}
        {/if}
    </div>
{/if}

