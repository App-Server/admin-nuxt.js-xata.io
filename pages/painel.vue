<template>
    <div>
        <Navbar />
        <div class="container">
            <h3>Painel</h3>
        </div>
    </div>
</template>

<style scoped>
h3 {
    margin-top: 65px;
}
</style>

<script>
    definePageMeta({
    middleware: 'auth'
    });
</script>

