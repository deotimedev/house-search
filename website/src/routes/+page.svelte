<script lang="ts">
    import Title from "$lib/components/Title.svelte";
    import {fly} from "svelte/transition"
    import {onMount} from "svelte";
    import Search from "$lib/components/Search.svelte";
    import {SyncLoader} from "svelte-loading-spinners"
    import Entry from "$lib/components/Entry.svelte";
    import {model} from "@house-search/utils"

    let ready = false
    onMount(() => ready = true)

    let results: Promise<model.Entry[]> | undefined
</script>


{#if ready}
    <div class="flex flex-col items-center space-y-5 pt-52" style="height: 100%">
        <div transition:fly={{ y: 100, duration: 1000 }}><Title/></div>
        <div transition:fly={{ y: 200, duration: 1000 }}>
            <Search on:search={(e) => {
                // TODO make query here
                const query = e.detail.query
                results = (async () => {
                    const res = await fetch(`/search?q=${query}`)
                    return await res.json()
                })()
            }}/>
        </div>

        <!--{#if results}-->
        <!--    {#await results}-->
        <!--        <SyncLoader size="60" color="#FFFFFF" unit="px" duration="0.5s"/>-->
        <!--    {:then results}-->
        <!--        {#each results as result, i}-->
        <!--            <div in:fly|global={{ y: 150, duration: 1000, delay: (i * 100) }} class="min-w-[100%] flex items-center flex-col">-->
        <!--                <Entry entry={result} />-->
        <!--            </div>-->
        <!--        {/each}-->
        <!--    {/await}-->
        <!--{/if}-->

        {#each [1, 2, 3] as n}
            <div class="flex items-center flex-col">
                <Entry entry={{
                            text: "Hello i am doctor house",
                            // text: "And what do you have to do to get an A in You’re Dying 101? They grade you on gentleness and supportiveness? Is there a scale for measuring compassion? This buddy of mine, I gotta give him ten bucks every time somebody says “Thank you.” Imagine that. This guy’s so good, people thank him for telling them that they’re dying. [He looks at his picture.] Eh, needs brown. I don’t get thanked that often.",
                            character: "House",
                            ep: {
                                season: 5,
                                number: 12
                            }
                        }} />
            </div>
        {/each}
    </div>
{/if}

