<script>
    import Router from 'svelte-spa-router';
    import NewHome from './NewHome.svelte';
    import Pedidos from './pages/Pedidos.svelte';
    import EditTablaPedidos from './pages/EditTablaPedidos.svelte';
   


    const routes = {
        "/": NewHome,
        "/pedidos": Pedidos,
        "/pedidos/:id": EditTablaPedidos

        

    }

</script>

<main>
    <Router {routes}/>
</main>

