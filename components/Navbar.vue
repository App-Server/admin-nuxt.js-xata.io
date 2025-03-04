<template>
    <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
            <div class="container">
                <a class="navbar-brand" href="#">Navbar</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                    <NuxtLink to="/painel" class="nav-link active" aria-current="page" href="#">Painel</NuxtLink>
                    </li>
                    <li class="nav-item">
                    <NuxtLink to="user" class="nav-link" href="#">User</NuxtLink>
                    </li>
                </ul>
                <form class="d-flex" role="search">
                    <NuxtLink to="/login" class="nav-link" href="#">Sair</NuxtLink>
                </form>
                </div>
            </div>
        </nav>
    </div>
</template>