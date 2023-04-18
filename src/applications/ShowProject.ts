import { BaseCommandInteraction, Client, MessageActionRow, MessageButton, ButtonInteraction, MessageEmbed, AnyChannel, TextChannel, SelectMenuInteraction, Formatters, MessageSelectMenu, ApplicationCommandOptionData, ApplicationCommandSubCommandData } from "discord.js";
import { time, userMention } from '@discordjs/builders';
import { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote, hyperlink } from '@discordjs/builders';
import { Command } from "src/Command";
import axios from "axios";
import { IDiscordLocation, IProject } from "./ProjectAdmin";

export const DisplayProject = async (client: Client, project: IProject, discordLocation: IDiscordLocation) => {
    const channel: TextChannel | undefined = client.channels.cache.get(discordLocation.channelId) as TextChannel;

    if(channel && project.name && project.name.length > 0) {
        // Create the embed
        const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle("Project: " + project.name)
        .setFooter({ text: 'Project ID: ' + project._id })
        .setURL('https://discord.js.org/')
        .setDescription(project.description + " ")
        .addField("Total supply", project.supply?.toString() || 'TBD');

        //Add mint info
        project.mints.forEach(mint => {
            if (!mint) return;
            const date = new Date(mint.date);
            embed
            .addFields(
            { 
                name: 'Date & Time', 
                value: time(date, 'D') + "\r" + time(date, 't'), 
                inline: true 
            },
            { 
                name: 'Mint Price:', 
                value: blockQuote(`${mint.price} SOL`), 
                inline: true 
            },
            { 
                name: 'Supply:', 
                value: blockQuote(`${mint.supply}`), 
                inline: true 
            })
        })

        //Add links
        let linksCount = 0;
        if(project.links[0].uri && project.links[0].uri.length > 1) {
            embed.addFields( 
                { 
                    name: 'Links',
                    value: hyperlink('Twitter', project.links[0].uri),
                    inline: true
                }
            )
            linksCount++;
        } 
        if(project.links[1].uri && project.links[1].uri.length > 1) {
            embed.addFields( 
                { 
                    name: '\u200b',
                    value: hyperlink('Discord', project.links[1].uri),
                    inline: true
                }
            )
            linksCount++;
        } 
        if(project.links[2].uri && project.links[2].uri.length > 1) {
            embed.addFields( 
                { 
                    name: '\u200b',
                    value: hyperlink('Website', project.links[2].uri),
                    inline: true
                }
            )
            linksCount++;
        }

        for(let currentLinkCount = linksCount; currentLinkCount < 3; currentLinkCount++){
            embed.addFields( 
                { 
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                }
            )
        }

        channel.messages.fetch(discordLocation.messageId).then(msg => msg.edit({embeds: [embed]}));
    } 
}

//TODO remove messageID and channelID and derive it from project
const ShowProject = async (client: Client, interaction: BaseCommandInteraction) => {
    try {
        // Get project from APIv2
        const message = await interaction.reply({content: "Fetching project... ", fetchReply: true});

        const response = await axios.post(process.env.MAGNUM_API + '/v2/alpha/show_project', {
            projectId: interaction.options.data[0].value,
            channelId: interaction.channelId,
            messageId: message.id,
        });

        const project: IProject = response.data;

        if(project) {
            const location: IDiscordLocation = {
                messageId: message.id,
                channelId: interaction.channelId,
            };
            DisplayProject(client, project, location);
        }
    }catch(error){
        interaction.editReply({content: "Cannot get project"})
    }
}

export const ShowProjectCMD: Command = {
    name: "show_project",
    description: "Show a project",
    type: "CHAT_INPUT",
    options: [
        {
            name: "id",
            type: "STRING",
            description: "The project id",
            required: true,
        },
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        ShowProject(client, interaction);
    },
}