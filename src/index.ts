import 'dotenv/config'
import { Client, Intents } from "discord.js";
import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";
import axios from 'axios';
const discordModals = require('discord-modals');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.login(process.env.DISCORD_TOKEN);

if(process.env.API_KEY) {
    axios.defaults.headers.common = {
        API_Key: process.env.API_KEY,
    };
}


discordModals(client);
ready(client);
interactionCreate(client);