# SETTE E MEZZO CLONE

# Elaborato per il corso di Sistemi Distribuiti

## Abstract

Si vuole sviluppare una versione digitale e distribuita del noto gioco di carte ”Sette e mezzo”, seguendo alcune delle regole classiche ed altre che verranno rivisitate. L’obiettivo per i giocatori è avvicinarsi il più possibile al punteggio di sette e mezzo, sommando i punteggi delle carte che via via richiedono al ”mazziere”, senza però ”sballare” (andare oltre). In tal caso si perde immediatamente.

Gli utenti, per giocare, dovranno connettersi ad un applicativo CLI, che permetterà loro di creare o partecipare ad una stanza di gioco, tramite la quale potranno giocare con altri utenti. Nel momento in cui l’utente crea una stanza, egli dovrà scegliere il numero dei partecipanti che vi potranno entrare e il numero di round da svolgere. Quando la stanza sarà piena, il suo creatore potrà avviare la partita.

All’avvio della partita, ogni giocatore riceverà dal mazziere una carta coperta casuale estratta dal mazzo. La carta iniziale può essere vista solo dal giocatore che l’ha ricevuta. Da quel momento in poi il gioco si svolgerà a turni.

Ad ogni turno, al giocatore verrà domandato se desidera ricevere un’altra carta: in caso affermativo la carta verrà assegnata scoperta al giocatore, in modo che tutti i giocatori possano vederla. Questo procedimento si ripete fino a quando il giocatore di turno non decida di rifiutare la carta offerta dal mazziere, oppure nel caso abbia ottenuto un punteggio maggiore a sette e mezzo. Nel secondo caso, il giocatore ha ”sballato” e perde la manche, nel primo caso egli attenderà a carte scoperte la fine della manche.
Alla fine del round, vince chi si è avvicinato di più al punteggio di sette e mezzo, è possibile anche avere più vincitori. Questa sequenza di gioco verrà ripetuta tante volte quante è stato deciso alla creazione della stanza. La partita invece viene vinta da chi ottiene il numero maggiore di vittorie.

## Deployment Instructions
Di seguito verranno fornite le indicazioni per un corretto deployment dell'applicativo.

Per il deployment sia del client che del server è necessario aver installato il Node Package Manager "npm", in una versione pari o superiore alla 8.0.

### Server

È possibile svolgere il deployment del server in locale in due modi:
1. Posizionarsi da terminale all'interno della cartella *server* e lanciare in sequenza i seguenti comandi:

     *npm i --silent*

     *npm run deployment*

2. Deployment con docker, quindi dalla root del progetto eseguire i comandi:

     *docker build -t server .*

     *docker run -p 3000:3000 server*

Dopodiché si avrà il server funzionante in ascolto su <http://localhost:3000/> .

Per poter eseguire l'applicativo su dispositivi diversi, è stato deciso di hostare il server sulla piattaforma di hosting Railway. In questo caso è necessario creare un file *.env* all'interno della directory *client* con al suo interno: *SERVER_URL=https://settemezzo-clone-production.up.railway.app/*

Ciò permette dunque di connettere il client al server online.

### Client

Per ogni client che si vuole collegare al server, bisogna aprire un ulteriore terminale, nel quale posizionarsi all'interno della directory *client*.

La prima volta che si vuol far partire il client è necessario lanciare in successione i comandi:

*npm i --silent*

*npm run build*  (necessario solamente la prima volta)

*npm run start*

A questo punto sarà possibile procedere con la creazione di una partita come sopra descritto.

### Demo dell'elaborato 

È possibile visionare una piccola demo dell'elaborato con vari scenari d'uso al seguente [link](https://liveunibo-my.sharepoint.com/:v:/g/personal/angela_cortecchia_studio_unibo_it/EdDDO26GVGlHqivtucu7p3gBBMqQCQlJqVoWXuw7RYg2UA?e=svMGyE). La demo fa riferimento a due partite con tre giocatori, due dallo stesso pc, mentre uno da un pc esterno.
