import { ModalSubmitInteraction } from "discord-modals";
import { BaseCommandInteraction, ButtonInteraction, ChatInputApplicationCommandData, Client } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: BaseCommandInteraction) => void;
    modal_feedback?: (client: Client, interaction: ModalSubmitInteraction) => void;
    button?: (client: Client, interaction: ButtonInteraction) => void;
}

