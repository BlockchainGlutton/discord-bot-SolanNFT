import { ModalSubmitInteraction } from "discord-modals";
import { BaseCommandInteraction, Client, Interaction, ButtonInteraction, Formatters, MessageEmbed, MessageActionRow, MessageSelectMenu, SelectMenuInteraction} from "discord.js";
import { BTN_PROJECT_DOWNVOTE, BTN_PROJECT_UPVOTE } from "../applications/ShowMintcalendar";
import { BTN_CREATE_MINTDATE, BTN_SHOW_PROJECT_UPDATE, MODAL_ADD_MINTDATE, MODAL_NEW_PROJECT } from "../applications/ProjectAdmin";
import { Commands } from "../Commands";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            await handleSlashCommand(client, interaction);
        } else if(interaction.isButton()) {
            await handleButton(client, interaction);
        }else if(interaction.isSelectMenu()){
            await handleSelectMenu(client, interaction);
        }else{
            console.log("Unknown interaction");
            console.log(interaction);
        }
    });

    client.on('modalSubmit', async (modal) => {
        await handleModal(client, modal);
    });
};


const handleModal = async (client: Client, interaction: ModalSubmitInteraction): Promise<void> => {
    if(interaction.customId === MODAL_ADD_MINTDATE || interaction.customId === MODAL_NEW_PROJECT){
        const cmd = Commands.find(c => c.name === 'new_project');
        if(cmd && cmd.modal_feedback) {
            cmd.modal_feedback(client, interaction);
        }
    }
}

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    try{
        const slashCommand = Commands.find(c => c.name === interaction.commandName);
        if (!slashCommand) {
            interaction.reply({ content: "An error has occurred" });
            return;
        }

        slashCommand.run(client, interaction);
    } catch (error) {
        interaction.reply({ content: "An error has occurred" });
    }
};

const handleButton = async (client: Client, interaction: ButtonInteraction): Promise<void> => {
    if (interaction.customId === BTN_PROJECT_UPVOTE || interaction.customId === BTN_PROJECT_DOWNVOTE ) {
        const cmd = Commands.find(c => c.name === 'show_calendar');
        if(cmd && cmd.button) {
            cmd.button(client, interaction);
        }
	} else if (interaction.customId === BTN_SHOW_PROJECT_UPDATE){
        const cmd = Commands.find(c => c.name === 'new_project');
        if(cmd && cmd.button) {
            cmd.button(client, interaction);
        }
    } else {
        await interaction.update({ content: 'Unknown interaction' });
    }
};

const handleSelectMenu = async (client: Client, interaction: SelectMenuInteraction): Promise<void> => {

};