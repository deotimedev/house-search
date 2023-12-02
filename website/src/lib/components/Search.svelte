<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Select from "svelte-select";
    import { page } from "$app/stores";
    import CharacterIcon from "./CharacterIcon.svelte";

    let value = ``;
    const dispatch = createEventDispatcher();

    // there has to be a better way of this but i cant find something compatible with cf workers
    const characters = [
        "Amber",
        "Cameron",
        "Chase",
        "Cuddy",
        "Foreman",
        "House",
        "Kutner",
        "Lucas",
        "Masters",
        "Stacy",
        "Taub",
        "Thirteen",
        "Tritter",
        "Unknown",
        "Vogler",
        "Wilson",
    ];

    let characterFilter: { value: string } | undefined;
    const doSearch = () =>
        dispatch("search", {
            query: characterFilter
                ? `${characterFilter.value}: ${value}`
                : value,
        });
</script>

<div class="w-screen flex flex-row space-x-3 justify-center max-h-[5vh]">
    <div class="items-center flex w-[10%] min-w-[90px]">
        <Select
            items={characters}
            --item-height="100%"
            placeholder="Filter Character"
            bind:value={characterFilter}
        >
            <div class="flex self-center items-center" slot="item" let:item>
                <CharacterIcon character={item.label} class="max-h-[3.5vw]" />
                <p class="pl-5">{item.label}</p>
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
                <p class="pl-2">{selection.label}</p>
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

<!-- <div class="w-screen flex flex-row justify-center pt-[1vh]">

</div> -->
