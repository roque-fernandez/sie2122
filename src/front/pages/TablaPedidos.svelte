<script>
    import { onMount } from 'svelte';
	import {Pagination, PaginationItem, PaginationLink, Table, Button, Alert } from "sveltestrap";

	//vatiables para mostrar mensajes
	let visibleError = false;
	let visibleMsg = false;
	let errorMsg = "";
	let msg = "";


	//variables para la paginacion
	let c_offset = 0;
    let offset = 0;
    let limit = 10;
    let c_page = 1;
    let lastPage = 1;
    let total = 0;

    
    let data = [];
    
	let newPedido = 
		{
            id: "",
            producto: "",
            cantidad: "",
            fecha: "",
            comprador: "",
			entregado: ""
    
        }; 

    onMount(getData);

    async function getData(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v1/pedidos?limit="+limit);
        if(res.ok){
            data = await res.json();
			total = data.length;
			getDataPaging();
            console.log("Pedidos: "+data.length);
        }else{
			errors(res.status);
		}
    }

	async function getDataPaging() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v1/pedidos"+ "?limit=" + limit + "&offset=" + c_offset);
		
        if(res.ok){
			console.log("getDataPaging Ok.");
			data = await res.json();
			console.log("Pedidos: "+data.length);
			update();
		}else{
			errors(res.status);
		}
  	}

	async function loadData(){
        console.log("Loading stats....");
        const res = await fetch("/api/v1/pedidos/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				if(res.ok){
					getData();
					update();
					visibleError = false;
					visibleMsg = true;
					msg = "Pedidos cargados con éxito";
					printPagingEstate();

				}
				else{
					errors(res.status);
				}
			});
    }

	async function deleteData(){
        console.log("Deleting stats....");
        const res = await fetch("/api/v1/pedidos",
			{
				method: "DELETE"
			}).then(function (res){
				if(res.ok){
					getData();
					visibleError = false;
					visibleMsg = true;
					msg = "Pedidos eliminados con éxito";
					printPagingEstate();

				}
				else{
					errors(res.status);
				}
			});
    }

	async function deletePedido(idDelete){
        console.log("Deleting entry.... ");
        const res = await fetch("/api/v1/pedidos/"+idDelete,
			{
				method: "DELETE"
			}).then(function (res){
				if(res.ok){
					getData();
					visibleError = false;
					visibleMsg = true;
					msg = "Entrada eliminada con éxito";
					total-=1;
					printPagingEstate();
				}
				else{
					errors(res.status);
				}
			});
    }

	async function insertData(){
		console.log("Inserting stat...."+JSON.stringify(newPedido));
		if(!!newPedido.id){
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
					getData();
					getDataPaging();
					visibleError = false;
					visibleMsg = true;
					msg = "Estadística introducida con éxito";
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
			errorMsg = "Falta campo id";
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

	async function update() {
      const res = await fetch("/api/v1/pedidos");
      if (res.status == 200) {
        const json = await res.json();
        total = json.length;
        changePage(c_page, c_offset);
      } 
    }

	function range(size, start = 0) {
      return [...Array(size).keys()].map((i) => i + start);
	}

	function changePage(page, offset) {
      
      lastPage = Math.ceil(total/limit);
      console.log("Last page = " + lastPage);
      if (page !== c_page) {
        c_offset = offset;
        c_page = page;
        getData();
		getDataPaging();
      }
    }
	
	function printPagingEstate(){
		console.log("----------------------");
		console.log("CPage: ",c_page," || LastPage: ",lastPage," || COffset: ",c_offset," || Total: ",total);
		console.log("----------------------");

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
</style>

<main>

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
                <th>Comprador</th>
                <th>Entregado</th>
				<th colspan="2">Operaciones</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input type="number" bind:value="{newPedido.id}"></td>
				<td><input bind:value="{newPedido.producto}"></td>
				<td><input type="number" bind:value="{newPedido.cantidad}"></td>
				<td><input bind:value="{newPedido.fecha}"></td>
				<td><input bind:value="{newPedido.comprador}"></td>
				<td><input bind:value="{newPedido.entregado}"></td>

				
				<td colspan="2"><Button block outline color="primary" on:click="{insertData}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each data as pedido}
				<tr>
					<td>{pedido.id}</td>
					<td>{pedido.producto}</td>
					<td>{pedido.cantidad}</td>
					<td>{pedido.fecha}</td>
					<td>{pedido.comprador}</td>
					<td>{pedido.entregado}</td>

					<td><Button outline color="warning" on:click={function (){
						window.location.href = `/#/pedidos/${pedido.id}`
					}}>
						Editar
					</Button>
					<td><Button outline color="danger" on:click={deletePedido(pedido.id)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={loadData}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={deleteData}>
					Borrar todo
				</Button></td>
				<td></td>
				<td></td>
				<td></td>
				<td colspan="2"></td>

			</tr>

		</tbody>

		

	</Table>

	<div>
		<Pagination ariaLabel="Web pagination">
		  <PaginationItem class = {c_page === 1 ? "disabled" : ""}>
				<PaginationLink previous href="#/tabla-pedidos" on:click={() => changePage(c_page - 1, c_offset - 10)}/>
		  </PaginationItem>
		  {#each range(lastPage, 1) as page}
				<PaginationItem class = {c_page === page ? "active" : ""}>
				  <PaginationLink previous href="#/tabla-pedidos" on:click={() => changePage(page, (page - 1) * 10)}>
					  {page}
				  </PaginationLink>
				</PaginationItem>
		  {/each}
		  <PaginationItem class = {c_page === lastPage ? "disabled" : ""}>
				<PaginationLink next href="#/tabla-pedidos" on:click={() => changePage(c_page + 1, c_offset + 10)}/>
		  </PaginationItem>
		</Pagination>

  </div>

{/await}
</main>


