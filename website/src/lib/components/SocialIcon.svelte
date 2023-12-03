<script lang="ts">
    import _ from "lodash";

    export let type: string;
    export let link: string;
    export let username: string;
</script>

<a href={link}>
    <div class="icon inline-flex min-w-[30px] w-[2.5vw] bg-white p-[10px] rounded-full" >
        <img
            title="{_.capitalize(type)} ({username})"
            alt={type}
            src="https://unpkg.com/simple-icons@v10/icons/{type}.svg"
        />
    </div>
</a>

<style>
    .icon {
        /* box-shadow: inset 0; */
        transition: transform 0.3s ease-out, box-shadow 0.2s ease-out;
    }
    .icon:hover {
        transform: translate(0, -5px);
        box-shadow: 0px 0px 1px 5px rgba(255, 255, 255, 0.5);
        /* box-shadow: inset 2px 2px rgba(0, 0, 0, 0.25); */
    }
</style>