<script lang="ts">
    import type {VectorizeInfo} from "./+page.server";

    export let data: VectorizeInfo
</script>
<h3>Vectors: {data.size}</h3>
<h1>Search</h1>
<form action="./search">
    <label for="search">Query:</label>
    <input id="search" name="q" type="search" placeholder="Enter search" required>
</form>
<br>
<form action="./nuke">
    <button type="submit">CLICK TO NUKE VECTORS!!!</button>
</form>