<script>
    import Icon from '@iconify/svelte';
    import * as XLSX from "xlsx";
    // import { supabase } from "$lib/supabaseClient.js";
    import readXlsxFile from 'read-excel-file';
    import { json } from '@sveltejs/kit';
    import { goto, invalidateAll } from '$app/navigation';

    export let data;
    // console.log(data);

    let { supabase } = data;

    let isOpen = false;

    function openBar() {
        if (isOpen===false) {
            isOpen=true;
        } else if (isOpen===true) {
            isOpen=false;
        }
    }

    async function handleLogout() {
        console.log("signing out");
        const {error } = await supabase.auth.signOut();

        invalidateAll()

        console.log(error)
        // location.reload();
    }

    function navtigate(path) {
        goto(path);
    }
</script>

<main>
    <div class="sidebar">
        {#if isOpen===true}
        <div class="content">
            <div class="add" on:click={() => navtigate('/crm')}>
                Home
            </div>
            <div class="add" on:click={() => navtigate('/crm/add')}>
                Add row
            </div>
            <div class="dashboard" on:click={() => navtigate('/crm/dashboard')}>
                Dashboard
            </div>
            <div class="logout" on:click={handleLogout}>
                Logout
            </div>
        </div>
        {/if}

        <div class="arrow" on:click={openBar}>
            {#if isOpen===false}
            <Icon icon="majesticons:arrow-left-line" width="24" height="24"></Icon>
            {:else}
            <Icon icon="majesticons:arrow-right-line" width="24" height="24"></Icon>
            {/if}
        </div>
    </div>
    <div class="table">
        <slot/>
    </div>
</main>

<style lang="scss">
    main {
        display: flex;
        font-family: 'Poppins';

        .sidebar {
            display: relative;
            padding: 0.5rem;
            display: flex;
            flex-direction: row;
            gap: 0.5rem;

            .content {
                height: 100vh;
                width: 15vw;
                display: flex;
                padding-top: 2rem;
                flex-direction: column;
                gap: 0.5rem;

                .add {
                    display: flex;
                    padding: 0.2rem;
                }

                .dashboard {
                    display: flex;
                    padding: 0.2rem;

                }

                .logout {
                    display: flex;
                    padding: 0.2rem;
                    background-color: white;
                    color: #e9686a;
                }

                .add:hover {
                    background-color: rgb(224, 209, 209);
                    cursor: pointer;
                }

                .dashboard:hover{
                    background-color: rgb(224, 209, 209);
                    cursor: pointer;
                }

                .logout:hover {
                    background-color: #e9686a;
                    color: white;
                    cursor: pointer;
                }
            }

            .arrow {
                padding: 0.3rem;
                height:fit-content
            }
            .arrow:hover {
                background-color: rgb(224, 209, 209);
                cursor: pointer;
            }
        }
    }

    .table {
        margin: auto;
    }
</style>