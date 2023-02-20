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

Per poter eseguire l'applicativo su dispositivi diversi, è stato deciso di hostare il server sulla piattaforma di hosting Railway. In questo caso per usufruirne basta seguire le indicazioni specifiche per il deployment del client in seguito.

### Client

Per ogni client che si vuole collegare al server, bisogna aprire un ulteriore terminale, nel quale posizionarsi all'interno della directory *client*.

La prima volta che si vuol far partire il client è necessario lanciare il comandio:

*npm i --silent*

Dopodiché si possono avere due casistiche di utilizzo:

1. Utilizzo in **locale**: in questo caso si può giocare con vari terminali (giocatori) ma dallo stesso pc. 
   Per far partire l'applicativo basterà lanciare da terminale il seguente comando:

    *npm run start-local*
    
2. Utilizzo in **rete**: in questo caso è sempre possibile far giocare vari utenti dallo stesso pc, ma in aggiunta si può giocare con altri utenti collegati online da pc diversi. 
   Per fare ciò bisognerà lanciare da terminale il seguente comando:

    *npm run start-remote*

A questo punto sarà possibile procedere con la creazione di una partita come sopra descritto.

##### NOTA: 
Per poter creare i due script all'interno del package.json, è stato necessario utilizzare il pacchetto npm *cross-env*, che permette di creare un file .env automaticamente dall'interno di uno script, con al suo interno l'url del server. 
Dalla documentazione fornita fanno notare che potrebbe presentarsi un problema su macchine Windows, ovvero npm utilizza cmd di default, che non supporta la sostituzione di comandi, dalla documentazione ufficiale forniscono come soluzione modificare il proprio *.npmrc* e settare *script-shell* a *powershell*.

In alternativa si può creare in autonomia un file .env all'interno della directory *client* ed inserire **SERVER_URL=https://settemezzo-clone-production.up.railway.app/**
per poi eseguire in successione i seguenti comandi:

*npm run build*

*npm run start*

## Demo dell'elaborato 

È possibile visionare una piccola demo dell'elaborato con vari scenari d'uso al seguente [link](https://liveunibo-my.sharepoint.com/:v:/g/personal/angela_cortecchia_studio_unibo_it/EXwqwsBeIudAtYuwSBwsesoBUSqGN25l5CqyRn6xjIw1WQ?e=Y2DvZr). La demo fa riferimento a due partite con tre giocatori, due dallo stesso pc, mentre uno da un pc esterno.
