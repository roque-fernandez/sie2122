<script>
    import {
      Button,
      Card,
      CardBody,
      CardFooter,
      CardHeader,
      CardSubtitle,
      CardText,
      CardTitle,
      Col,
      Container,
      Row,
    } from "sveltestrap";
  </script>
  
  <main>
    <h1>Obrador La Hogaza</h1>

    <img src="data:image/jpeg;base64,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">
  
    <h3>Visite nuestra página web</h3>

    <a href="http://obradorlahogaza.com/">
      <p>Aquí</p>
    </a>

   
  
    <Container>
      <Col xs="auto">
        <Card class="mb-3">
          <CardHeader>
            <CardTitle><h3>Realice un nuevo pedido</h3></CardTitle>
          </CardHeader>
          <CardBody>
            <CardSubtitle />
          

            <a href="/#/nuevo-pedido">
              <Button color="primary">Pedir</Button>
            </a>


            </CardBody>

          <CardFooter>
            <h4>Los pedidos se recogerán en el obrador en el día especificado</h4>
          </CardFooter>
        </Card>

      </Col>

      <Col xs="auto">
        <Card class="mb-3">
          <CardHeader>
            <CardTitle><h3>Gestión de pedidos</h3></CardTitle>
          </CardHeader>
          <CardBody>
            <CardSubtitle />
          

            <a href="/#/pedidos">
              <Button color="primary">Ver</Button>
            </a>


            </CardBody>

          <CardFooter>
            <h4>Esta opción solo es válido para personal</h4>
          </CardFooter>
        </Card>

      </Col>
      
    </Container>
  </main>
  
  <style>
    main {
      text-align: center;
      padding: 1em;
      max-width: 240px;
      margin: 0 auto;
    }
    h1 {
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 4em;
      font-weight: 100;
      padding-bottom: 0.5em;
    }
    h3{
      padding-top: 1em;
    }
    b {
      color: #00c1ff;
    }
    
    @media (min-width: 640px) {
      main {
        max-width: none;
      }
    }
  </style>