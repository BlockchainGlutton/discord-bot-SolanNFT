import { BaseCommandInteraction, Client, MessageActionRow, MessageButton, ButtonInteraction, MessageEmbed, AnyChannel, TextChannel, SelectMenuInteraction, Formatters, MessageSelectMenu, ApplicationCommandOptionData, ApplicationCommandSubCommandData, TextBasedChannel } from "discord.js";
import { time, userMention } from '@discordjs/builders';
import { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote, hyperlink, codeBlock } from '@discordjs/builders';
import { Command } from "src/Command";
import axios from "axios";
import { IDiscordLocation, IProject, ProjectSummary } from "./ProjectAdmin";

export const BTN_PROJECT_UPVOTE = 'btn-project-upvote';
export const BTN_PROJECT_DOWNVOTE = 'btn-project-downvote';

export const GenerateEmbed = async (project: ProjectSummary): Promise<MessageEmbed | undefined> => {
    // Create the embed
    const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle("Project: " + project.name)
    .setURL('https://www.magnumai.io/')
    .addField("Total supply", (project.supply && project.supply.toLocaleString()) || 'TBD');

    if (project.imageURI) {
        embed.setThumbnail(project.imageURI);
    }

    if(!project.mints || project.mints.length == 0) return;
    project.mints.forEach(mint => {
        if(!mint) return;
        const date = new Date(mint.date);

        embed
        .addFields(
        { 
            name: (mint.token_based && 'WL') || 'Public',
            value: time(date, 'D') + ' ' + time(date, 't'), 
            inline: true 
        },
        { 
            name: 'Mint Price:', 
            value: `${mint.price} SOL`, 
            inline: true 
        },
        { 
            name: 'Supply:', 
            value: `${mint.supply.toLocaleString()}`, 
            inline: true 
        })
    })  

    embed
        .addFields(
        { 
            name: 'Vote results',
            value: `<:up_arrow_green:984738957449392128> ${project.upvotes} \u200b \u200b <:down_arrow_red:984738971789692938> ${project.downvotes}`, 
            inline: true
        })

    if(project.review_ids.length > 0){
        embed
        .addFields(
        { 
            name: 'Review',
            value: hyperlink('Link to review', `https://magnumai.io/review/${project.review_ids[0]}`), 
            inline: true
        })
    }

    if(project.whitelistToken && project.whitelistToken.length > 0)
    {
        embed.addFields(
            {
                name: 'WL token',
                value: '<:fff:984742130775916565> ' + hyperlink(project.whitelistToken, `https://famousfoxes.com/tokenmarket/${project.whitelistToken}`), 
            }
        )
    }     
    return embed;
}

export const GenerateButtons = async (project: ProjectSummary): Promise<MessageActionRow | null> => {
    let buttons = new MessageActionRow()
        
    buttons.addComponents(
        new MessageButton()
            .setCustomId(BTN_PROJECT_UPVOTE)
            .setStyle('SUCCESS')
            .setEmoji('984733874078744586')
    )

    buttons.addComponents(
        new MessageButton()
            .setCustomId(BTN_PROJECT_DOWNVOTE)
            .setStyle('DANGER')
            .setEmoji('984733887487938600')
    )

    if(project.links[0].uri && project.links[0].uri.length > 1) {
        //Twitter
        buttons.addComponents(
            new MessageButton()
            .setStyle('LINK')
            .setURL(project.links[0].uri)
            .setEmoji('984392308051034182')
        )
    } 
    if(project.links[1].uri && project.links[1].uri.length > 1) {
        //Discord
        buttons.addComponents(
            new MessageButton()
            .setStyle('LINK')
            .setURL(project.links[1].uri)
            .setEmoji('984391316911816714')
        )
    } 
    if(project.links[2].uri && project.links[2].uri.length > 1) {
        //Website
        buttons.addComponents(
            new MessageButton()
            .setStyle('LINK')
            .setURL(project.links[2].uri)
            .setEmoji('984393192550047785')
        )
    }

    return buttons;
}

export const DisplayNewProject = async (client: Client, project: ProjectSummary, channel: TextBasedChannel | null) => {
    if(channel && project.name && project.name.length > 0) {
       
        const embed = await GenerateEmbed(project);
        const buttons = await GenerateButtons(project);

        if(!embed || !buttons) return;

        const msg = await channel.send({embeds: [embed], components: [buttons]});
        
        const response = await axios.post(process.env.MAGNUM_API + '/v2/alpha/show_project', {
            projectId: project._id,
            channelId: msg.channelId,
            messageId: msg.id,
        }).catch(err => {
            msg.edit({content: "Error this message is not saved to the database and will not update.", embeds: [], components: []});
        });
    } 
}

//TODO remove messageID and channelID and derive it from project
const ShowCalendar = async (client: Client, interaction: BaseCommandInteraction) => {
  try {
    const today = new Date();
    
    const embed = new MessageEmbed()
        .setColor('#000000')
        .setTitle(`=== Project calendar of today ${time(today, 'D')} ===`)
        .setURL('https://magnumai.io/')
        .setThumbnail('https://www.magnumai.io/bootleg-bill.44809c5a.gif')
        .setAuthor({name: 'Magnum AI Bot', iconURL: 'https://www.magnumai.io/bootleg-bill.44809c5a.gif', url: 'https://magnumai.io/'})
        .setImage('')

    // Get project from APIv2
    const response = await axios.get(process.env.MAGNUM_API + '/v2/alpha/get_all_projects?today=true&summarized=true');

    const projects: ProjectSummary[] = response.data;

    embed.setDescription(projects.length + " projects minting today");

    await interaction.followUp({embeds: [embed]})

    projects.forEach(project => {
        DisplayNewProject(client, project, interaction.channel);
    })
    //DisplayProject(client, projects[0], interaction.channel);
      
    }catch(error){
        interaction.editReply({content: "Cannot get projects"})
    }
}

const processButtonVote = async (client: Client, interaction: ButtonInteraction, upvote: boolean) => {
    await interaction.deferReply({ephemeral: true});
    try {
        const projectParams = {
            messageId: interaction.message.id,
            channelId: interaction.channelId,
        };

        const response = await axios.get(process.env.MAGNUM_API + '/v2/alpha/get_project_from_message', {
            params: projectParams
        });

        const project: IProject = response.data;

        const voteParams = {
            projectId: project._id,
            vote: upvote,
            discordId: interaction.user?.id
        };

        const voteResponse = await axios.post(process.env.MAGNUM_API + '/v2/alpha/vote_project', voteParams);

        await interaction.followUp({content: "You voted " + project.name + " " + (upvote && '<:up_arrow_green:984738957449392128>' || '<:down_arrow_red:984738971789692938>'), ephemeral: true});

        const updatedProject: IProject = voteResponse.data;
        
        updateAllMessages(client, updatedProject);
    } catch (error: any) {
        console.log(error.response.data);
        interaction.followUp({content: "Error voting, please try again", ephemeral: true});
    }
}

const updateAllMessages = async (client: Client, project: IProject) => {
    //Update at all locations
    //Generate the summarized project first
    //Manually Count votes
    let upvotes = 0;
    let downvotes = 1;
    project.votes.forEach(vote => {
      if (vote.upvote) {
        upvotes++;
      } else {
        downvotes++;
      }
    });

    //Manually create list of reviews
    const reviews: string[] = [];
    project.reviews.forEach(review => {
      reviews.push(review._id);
    });

    const projectSummary = {
      _id: project._id,
      mints: project.mints,
      description: project.description,
      name: project.name,
      links: project.links,
      review_ids: reviews,
      upvotes: upvotes,
      downvotes: downvotes,
      whitelistRoleId: project.whitelistRoleId,
      discordServerId: project.discordServerId,
      supply: project.supply,
      imageURI: project.imageURI,
      whitelistToken: project.whitelistToken,
    };

    const embed = await GenerateEmbed(projectSummary);
    const buttons = await GenerateButtons(projectSummary);

    if(!embed || !buttons) return;

    project.discordLocations.forEach(async (discordLocation) => {
        try {
            const channel: TextChannel | undefined = client.channels.cache.get(discordLocation.channelId) as TextChannel;
                        
            if(channel){
                await channel.messages.fetch(discordLocation.messageId).then(msg => msg.edit({components: [buttons], embeds: [embed]}));
            } 
        }catch(error){
            console.log("Cannot edit message");
        }
    })
}

export const ShowCalendarCMD: Command = {
    name: "show_calendar",
    description: "Show the calendar of today",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        await interaction.deferReply();
        ShowCalendar(client, interaction);
    },
    button: async (client: Client, interaction: ButtonInteraction) => {
        if(interaction.customId === BTN_PROJECT_UPVOTE) {
            await processButtonVote(client, interaction, true);
        } else if(interaction.customId === BTN_PROJECT_DOWNVOTE) {
            await processButtonVote(client, interaction, false);
        }
    },
}