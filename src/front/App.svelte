<script>
    import Router from 'svelte-spa-router';
    import NewHome from './NewHome.svelte';
    import Pedidos from './pages/Pedidos.svelte';
    import EditTablaPedidos from './pages/EditTablaPedidos.svelte';
    import NewPedido from './pages/NewPedido.svelte'
   


    const routes = {
        "/": NewHome,
        "/pedidos": Pedidos,
        "/pedidos/:id": EditTablaPedidos,
        "/nuevo-pedido": NewPedido    
    }

</script>

<main>
    <Router {routes}/>
</main>

