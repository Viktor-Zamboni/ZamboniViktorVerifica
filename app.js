//Viktor, la tua stringa è: A5 B2 C4 D1 E3 F5
const express = require('express');
const fs = require('fs');
const parser = require('body-parser');
const app = express();
const port = 3000;

const categorie = JSON.parse(fs.readFileSync('categorie.json', 'utf8'));
const clienti = JSON.parse(fs.readFileSync('clienti.json', 'utf8'));
const dettagli = JSON.parse(fs.readFileSync('dettagli.json', 'utf8'));
const fornitori = JSON.parse(fs.readFileSync('fornitori.json', 'utf8'));
const ordini = JSON.parse(fs.readFileSync('ordini.json', 'utf8'));

app.use(express.static('./public'));

app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));


//pagina iniziale
app.get('/', (req, res) => {
    res.sendFile('./public/index.html', { root: __dirname });
});

//pagina con l'elenco degli ordini presi dalla lettura del file ordini.json inseriti in una tabella
app.get('/ordini', (req, res) => {
    res.json(ordini);
});

//pagina che dato un id cliente restituisce le date degli ordini effettuati
app.get('/ordini/:id', (req, res) => {
    const id = req.params.id;
    const ordine = ordini.filter(ordine => ordine.customerId === id);
    res.json(ordine);
});

//pagina che fornisce il numero di fornitori per ogni paese
app.get('/numero-fornitori', (req, res) => {
    const fornitoriPerPaese = fornitori.reduce((acc, fornitore) => {
        if (acc[fornitore.country]) {
            acc[fornitore.country]++;
        } else {
            acc[fornitore.country] = 1;
        }
        return acc;
    }, {});
    res.json(fornitoriPerPaese);
});

//inserimento di un nuovo cliente
app.post('/nuovo-clienti', (req, res) => {
    const nuovoCliente = req.body;
    clienti.push(nuovoCliente);
    res.json(clienti);
});

//modifica di un ordine
app.put('/modifica-ordini/:id', (req, res) => {
    const id = req.params.id;
    const ordine = ordini.find(ordine => ordine.id === id);
    ordine.customerId = req.body.customerId;
    ordine.employeeId = req.body.employeeId;
    ordine.orderDate = req.body.orderDate;
    ordine.requiredDate = req.body.requiredDate;
    ordine.shippedDate = req.body.shippedDate;
    ordine.shipVia = req.body.shipVia;
    ordine.freight = req.body.freight;
    ordine.shipName = req.body.shipName;
    res.json(ordine);
});   

//eliminazione di una categoria
app.delete('/elimina-categorie/:id', (req, res) => {
    const id = req.params.id;
    const categoria = categorie.find(categoria => categoria.idCat === id);
    categorie.splice(categorie.indexOf(categoria), 1);
    res.json(categorie);
});

//restituire l'elenco  dei prodotti
app.get('/prodotti', (req, res) => {
    res.json(dettagli);
});

//dato un paese restituire tutti i clienti di quel paese
app.get('/clienti/:paese', (req, res) => {
    const paese = req.params.paese;
    const clientiPaese = clienti.filter(cliente => cliente.country === paese);
    res.json(clientiPaese);
});

//pagina che restituisce i clienti che hanno effettuato ordini
app.get('/clienti-ordini', (req, res) => {
    const clientiOrdini = clienti.filter(cliente => ordini.some(ordine => ordine.customerId === cliente.id));
    res.json(clientiOrdini);
});

//pagina che inserisce un nuovo ordine
app.post('/nuovo-ordini', (req, res) => {
    const nuovoOrdine = req.body;
    ordini.push(nuovoOrdine);
    res.json(ordini);
});

//modifica di un ordine
app.put('/modifica-ordini/:id', (req, res) => {
    const id = req.params.id;
    const ordine = ordini.find(ordine => ordine.id === id);
    ordine.customerId = req.body.customerId;
    ordine.supplierId = req.body.supplierId;
    ordine.date = req.body.date;
    res.json(ordine);
});


//eliminazione di un cliente
app.delete('/elimina-clienti/:id', (req, res) => {
    const id = req.params.id;
    const cliente = clienti.find(cliente => cliente.id === id);
    clienti.splice(clienti.indexOf(cliente), 1);
    res.json(clienti);
});

//per tutte le altre richieste il server deve rispondere con un messaggio risorsa non trovata
app.use((req, res) => {
    res.status(404).send('Risorsa non trovata');
});

app.listen(port, () => {
    console.log(`Collegarsi a http://localhost:${port}`);
});

