<script lang="ts">
    import type {VectorizeInfo} from "./+page.server";
    import Title from "$lib/components/Title.svelte";

    export let data: VectorizeInfo
</script>
<Title />
<form action="./search">
    <label for="search">Query:</label>
    <input id="search" name="q" type="search" placeholder="Enter search" required>
</form>
<br>
<!--<form action="./nuke">-->
<!--    <button type="submit">CLICK TO NUKE VECTORS!!!</button>-->
<!--</form>-->