<script lang="ts">
    export let character: string;

    let src = `/characters/${character.toLowerCase()}.png`
</script>

<img
    alt={character}
    {src}
    class="rounded-full {$$props.class ?? ''}"
    on:error={() => {
        src = "/characters/unknown.png"
    }}
/>
