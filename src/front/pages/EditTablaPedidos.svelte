<script>

    export let params = {};
    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import {Table, Button, Alert } from "sveltestrap";


    let data = {};

    let updatedId;
    let updatedProducto;
    let updatedCantidad;
    let updatedFecha;
    let updatedComprador;
    let updatedEntregado;

    //vatiables para mostrar mensajes
	let visibleError = false;
	let visibleMsg = false;
	let errorMsg = "";
	let msg = "";

    onMount(getData);

    async function getData(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v1/pedidos/"+params.id); 
        if(res.ok){
            data = await res.json();
            updatedId = data.id;
            updatedProducto = data.producto;
            updatedCantidad = data.cantidad;
            updatedFecha = data.fecha;
            updatedComprador = data.comprador;
            updatedEntregado = data.entregado;
        }else{
            errors(res.status,params.id);
            pop();
        }
    }

    async function editData(){
        console.log("Updating entry...."+updatedId);
        updatedId = parseInt(updatedId);
        updatedCantidad = parseInt(updatedCantidad);

        const res = await fetch("/api/v1/pedidos/"+params.id,
			{
				method: "PUT",
				body: JSON.stringify({
                    id: updatedId,
                    producto: updatedProducto,
                    cantidad: updatedCantidad,
                    fecha: updatedFecha,
                    comprador: updatedComprador,
                    entregado: updatedEntregado

                }),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
                if(res.ok){
					visibleError = false;
					visibleMsg = true;
					msg = "Pedido modificado con éxito";
                    console.log("Respuesta: ",res.status);
				}
				else{
					errors(res.status);
				}
            }); 
    }

    async function errors(code,entrada){
        
        let msg;
        if(code == 404){
            msg = "La entrada "+entrada+" no existe"
        }
        if(code == 400){
            msg = "La petición no está correctamente formulada"
        }
        if(code == 409){
            msg = "El dato introducido ya existe"
        }
        if(code == 401){
            msg = "No autorizado"
        }
        if(code == 405){
            msg = "Método no permitido"
        }
        window.alert(msg)
            return;
    }

</script>

<main>
    <h1>Editar pedido {params.id}</h1>

    <Alert color="danger" isOpen={visibleError} toggle={() => (visibleError = false)}>
		{#if errorMsg}
			<p>ERROR: {errorMsg}</p>
		   {/if}
	</Alert>
	<Alert color="success" isOpen={visibleMsg} toggle={() => (visibleMsg = false)}>
		{#if msg}
			<p>Correcto: {msg}</p>
		{/if}
	</Alert>

    {#await data}
    loading
        {:then data}
        
    
        <Table bordered>
            <thead>
                <tr>
                    <th>Id</th>
				    <th>Producto</th>
				    <th>Cantidad</th>
				    <th>Fecha</th>
                    <th>Entregado</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{updatedId}</td>
                    <td><input bind:value="{updatedProducto}"></td>
                    <td><input type="number" bind:value="{updatedCantidad}"></td>
                    <td><input bind:value="{updatedFecha}"></td>
                    <td><input bind:value="{updatedComprador}"></td>
                    <td><input bind:value="{updatedEntregado}"></td>

                    <td><Button outline color="primary" on:click="{editData}">
                        Editar
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    {/await}
    
    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    </main>