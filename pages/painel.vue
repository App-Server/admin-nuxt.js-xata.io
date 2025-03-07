<template>
    <div>
        <Navbar />
        <div class="container-fluid">
            <h3>Painel</h3>
            <div class="row">
                <div class="col-sm-4 mb-3 mb-sm-3">
                    <div class="card">
                    <div class="card-body">
                        <p class="card-text">--</p>
                    </div>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="card">
                    <div class="card-body">
                        <p class="card-text">--</p>
                    </div>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="card">
                    <div class="card-body">
                        <p class="card-text">--</p>
                    </div>
                    </div>
                </div>
            </div>
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

