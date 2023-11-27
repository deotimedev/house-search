<script>
    import "../app.css";
</script>

<slot />

<style lang="postcss">
    :global(html) {
        height: 100%;
        background-color: theme(colors.black);
        background-image: url("/scan.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-attachment: fixed;
    }
</style>