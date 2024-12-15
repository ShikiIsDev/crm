<script>
    import { goto } from "$app/navigation";

    function tryAgain() {
        goto('/auth');
    }
</script>

<main>
    <p>Login Failed</p>
    <button on:click={tryAgain}>Try Again</button>
</main>

<style lang="scss">
    main {
        font-family: 'Poppins';
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center; 
        padding: 1.5rem;
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        max-width: 500px;
        margin:auto;

        button {
            width: fit-content;
            background-color: #007bff;
            color: white;
            border: 0px;
            border-radius: 2px;
            padding: 0.5rem;
        }
    }
</style>