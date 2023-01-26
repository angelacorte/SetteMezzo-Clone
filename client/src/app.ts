import { Client } from "./controller/Client";
import { GameManager } from "./controller/GameManager";
import { StartMenu } from "./controller/StartMenu";

const client = new Client()

StartMenu(client)
GameManager(client)
