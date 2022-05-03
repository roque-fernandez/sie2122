<script>

    import { onMount } from 'svelte';
	import { Table, Button, Alert } from "sveltestrap";

    //vatiables para mostrar mensajes
	let visibleError = false;
	let visibleMsg = false;
	let errorMsg = "";
	let msg = "";

    //variables para la nueva fecha
    let now = new Date(), month, day, year, dateString;

    let newPedido = 
		{
            id: "",
            producto: "",
            cantidad: "",
            fecha: "",
            comprador: "",
			entregado: ""
    
        }; 

    //array de productos
    let productos = [
        {id: 1, text: `Pan de trigo`},
        {id: 2, text: `Pan de espelta`},
        {id: 3, text: `Pan de centeno con albaricoques y nueces`},
        {id: 4, text: `Pan integral con dátiles y nueces`},
        {id: 5, text: `Pan de trigo con tomate y ciruelas`},
    ]
    let selected = '';


    async function insertData(){
        var randomNumber = Math.floor(Math.random() * 1000000);
        newPedido.id = randomNumber;
        newPedido.entregado = false;
        newPedido.fecha = dateString;
        newPedido.producto = selected.text;
        console.log("Producto: ",selected.text)
        console.log("Inserting stat...."+JSON.stringify(newPedido));
        if(!!newPedido.id && !!newPedido.producto && !!newPedido.cantidad && !!newPedido.fecha && !!newPedido.comprador ){
            //parseamos los campos numericos
            newPedido.id = parseInt(newPedido.id);
            newPedido.cantidad = parseInt(newPedido.cantidad);
            const res = await fetch("/api/v1/pedidos",
            {
                method: "POST",
                body: JSON.stringify(newPedido),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (res){
                if(res.ok){
                    newPedido.id ="";
                    newPedido.producto ="";
                    newPedido.cantidad ="";
                    newPedido.fecha ="";
                    newPedido.comprador ="";
                    newPedido.entregado ="";
                    selected="";
                    dateString = "";
                    visibleError = false;
                    visibleMsg = true;
                    msg = "Pedido realizado con éxito";
                    total+=1;
                    printPagingEstate();
                }
                else{
                    errors(res.status);
                }
            });
        }else{
            visibleMsg = false;
            visibleError = true;
            errorMsg = "Faltan campos obligatorios";
        }
        
    }

    function errors(code){
        let error;
		switch (code) {
			case 404:
				error = "La entrada " + newStat.id + " no existe"
				break;
			case 400:
				error = "La petición no está correctamente formulada"
				break;
			case 409:
				error = "El dato " + newStat.id + " ya existe"
				break;
			case 401:
				error = "No autorizado"
				break;
			case 405:
				error = "Método no permitido"
				break;
			default:
				error = "Error desconocido"
		}
		visibleMsg=false;
		visibleError=true;
        errorMsg = error;
        return;
    }

</script>

<style>
    /*table {
       width: 100%;
       border: 1px solid #000;
    }*/
    thead{
        background-color: #9381ff;
    }
    tbody{
        background-color: #f8f7ff;
    }
    th, td {
       width: 15%;
       text-align: center;
       vertical-align: center;
       border: 1px solid #000;
       border-spacing: 0;
    }

    h1{
        text-align: center;
        padding-bottom: 2em;
    }
</style>

<main>
    <body>
        <h1>Realice su nuevo pedido</h1>

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


        <Table bordered>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                    <th>Comprador</th>
                    <th colspan="2">Operaciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <select bind:value={selected}>
                            {#each productos as p}
                                <option value={p}>
                                    {p.text}
                                </option>
                            {/each}
                        </select>    
                    </td>
                    <td><input type="number" bind:value="{newPedido.cantidad}"></td>
                    <td><input type=date bind:value="{dateString}"></td>
                    <td><input bind:value="{newPedido.comprador}"></td>

                    
                    <td colspan="2"><Button block outline color="primary" on:click="{insertData}">
                        Añadir
                        </Button>
                    </td>
                </tr>
            </tbody>

        </Table>

    </body>

    

</main>