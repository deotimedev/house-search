<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Select from "svelte-select";
    import CharacterIcon from "./CharacterIcon.svelte";

    let value = ``;
    const dispatch = createEventDispatcher();

    const characters = [
        "House",
        "Cuddy",
        "Wilson",
        "Foreman",
        "Chase",
        "Cameron",
        "Thirteen",
        "Taub",
        "Kutner",
        "Amber",
        "Masters",
        "Adams",
        "Park",
        "Stacy",
        "Tritter",
        "Vogler",
    ];

    let characterFilter: { value: string } | undefined;
    const doSearch = () =>
        dispatch("search", {
            query: characterFilter
                ? `${characterFilter.value}: ${value}`
                : value,
        });

    let windowWidth = 0;
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="w-screen flex flex-row space-x-3 justify-center max-h-[5vh]">
    <div class="items-center flex w-[{windowWidth >= 1000 ? 10 : (characterFilter ? 10 : 5)}%] min-w-[{characterFilter ? 90 : 0}px]">
        <Select
            items={characters}
            --item-height="100%"
            --item-padding="0px"
            --padding="0px 10px 0px 5px"
            placeholder={windowWidth >= 1000 ? "Character" : undefined}
            bind:value={characterFilter}
        >
            <span slot="prepend">
                {#if windowWidth >= 1150 || !characterFilter}
                    <img
                        class="max-h-[20px] pr-1"
                        src="/filter.png"
                        alt="Filter character"
                    />
                {/if}
            </span>
            <div
                class="flex self-center items-center min-w-[50vw]"
                slot="item"
                let:item
            >
                <CharacterIcon
                    character={item.label}
                    class="max-h-[3.5vw] min-h-[30px]"
                />
                <p class="pl-[1vw]">{item.label}</p>
            </div>
            <div
                class="flex self-center items-center"
                slot="selection"
                let:selection
            >
                <CharacterIcon
                    character={selection.label}
                    class="min-h-[32px] min-w-[32px] max-h-[1.5vw]"
                />
                <p class="pl-[0.5vw]">{selection.label}</p>
            </div>
        </Select>
    </div>
    <input
        bind:value
        on:keydown={(e) => {
            if (e.key === "Enter") doSearch();
        }}
        id="search"
        name="q"
        type="search"
        placeholder="Enter query"
        class="rounded-2xl p-3 w-2/5"
        required
    />
    <button
        on:click={doSearch}
        class="flex justify-center items-center bg-blue-600 bg-blend-color rounded-2xl w-[10%] transition duration-300 ease-in-out hover:bg-blue-400 active:bg-blue-300"
    >
        <img class="max-h-[50%]" alt="Search" src="/search.png" />
    </button>
</div>

<style>
    :global(.svelte-select-list) {
        min-width: 150px !important;
    }
    :global(input.svelte-82qwg8::placeholder) {
        font-size: max(1vw, 10px);
    }
</style>
