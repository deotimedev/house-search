<script lang="ts">
    import Title from "$lib/components/Title.svelte";
    import {fly} from "svelte/transition"
    import {onMount} from "svelte";
    import Search from "$lib/components/Search.svelte";
    import Entry from "$lib/components/Entry.svelte";
    import type {ScoredEntry} from "./search/SearchResults";
    import _ from "lodash";
    import SocialIcon from "$lib/components/SocialIcon.svelte";

    let ready = false
    onMount(() => ready = true)

    let results: Promise<ScoredEntry[]> | undefined
</script>


{#if ready}
    <div class="flex justify-end pr-[2vw] pt-[2vw]">
        <SocialIcon 
            type="github"
            username="@deotimedev"
            link="https://github.com/deotimedev/house-search"
        />
    </div>
    <div class="flex flex-col items-center space-y-5 pt-[15.6vh]" style="height: 100%">
        
        <div transition:fly={{ y: 100, duration: 1000 }}><Title/></div>
        <div transition:fly={{ y: 200, duration: 1000 }}>
            <Search on:search={(e) => {
                const query = e.detail.query
                console.log(`The query in question: ${query}`)
                results = (async () => {
                    const res = await fetch(`/search?q=${query}`)
                    return await res.json()
                })()
            }}/>
        </div>

        <!-- {#if results}
            {#await results}
                <SyncLoader size="60" color="#FFFFFF" unit="px" duration="0.5s"/>
            {:then results}
                {#each (_.orderBy(results, "score", "desc")) as result, i}
                    <div in:fly|global={{ y: 150, duration: 1000, delay: (i * 100) }} class="min-w-[100%] flex items-center flex-col">
                        <Entry entry={result} />
                    </div>
                {/each}
            {/await}
        {/if} -->

         {#each [1, 2, 3, 4] as n}
            <div class="flex items-center flex-col">
                <Entry entry={{
                            text: "(shouting) Life is pain! I wake up every morning, I'm in pain. I go to work in pain. You know how many times I wanted to just give up? How many times I thought about ending it?",
                            character: "House",
                            ep: {
                                season: 8,
                                number: 21
                            },
                            id: "idk",
                            score: 5,
                            replyingTo: {
                                text: "You can't just e choice. He just doesn’tsadfsdaffsdfsdfasdadsf  asdfasdf wdsafasdfsdfant to live in pain.",
                                character: "Taub",
                                ep: {
                                    season: 8,
                                    number: 21
                                }
                            }
                        }} />
            </div>
        {/each} 
    </div>
{/if}

