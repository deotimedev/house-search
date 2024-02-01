<script lang="ts">
    import Title from "$lib/components/Title.svelte";
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import Search from "$lib/components/Search.svelte";
    import Entry from "$lib/components/Entry.svelte";
    import type { ScoredEntry } from "./search/SearchResults";
    import _ from "lodash";
    import { SyncLoader } from "svelte-loading-spinners";
    import SocialIcon from "$lib/components/SocialIcon.svelte";

    let ready = false;
    onMount(() => (ready = true));

    let results: Promise<ScoredEntry[]> | undefined;

    async function search(query: string) {
        const res = await fetch(`/search?q=${query}`);
        if (!res.ok) throw new Error("Error making search")
        return await res.json();
    }
</script>

{#if ready}
    <div class="flex justify-end pr-[2vw] pt-[2vw]">
        <SocialIcon
            type="github"
            username="@deotimedev"
            link="https://github.com/deotimedev/house-search"
        />
    </div>
    <div
        class="flex flex-col items-center space-y-5 pt-[15.6vh]"
        style="height: 100%"
    >
        <div transition:fly={{ y: 100, duration: 1000 }}><Title /></div>
        <div transition:fly={{ y: 200, duration: 1000 }}>
            <Search
                on:search={(e) => {
                    const query = e.detail.query;
                    results = search(query)
                }}
            />
        </div>

        {#if results}
            {#await results}
                <SyncLoader size="60" color="#FFFFFF" unit="px" duration="0.5s" />
            {:then results}
                {#each _.orderBy(results, "score", "desc") as result, i}
                    <div
                        in:fly|global={{
                            y: 150,
                            duration: 1000,
                            delay: i * 100,
                        }}
                        class="min-w-[100%] flex items-center flex-col"
                    >
                        <Entry entry={result} />
                    </div>
                {/each}
                <br>
                <p class="max-w-[40vw] text-[max(0.75vw,10px)] text-center text-white">
                    <strong>Can't find the quote you're looking for?</strong> Try using the character filter to the left of the search bar, or including more specific terms in the search.
                </p>
                <br>
            {:catch}
                <div class="flex items-center bg-red-400 rounded-md pr-5 border-red-500 border-4 max-w-[50%]">
                    <img class="object-cover max-h-[5vh]" src="/error.png" alt="Error">
                    <p class="text-[max(1vw,10px)] font-bold text-white">An error occurred while making this search, please try again later.</p>
                </div>
            {/await}
        {/if}
    </div>
{/if}
