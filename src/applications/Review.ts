import { BaseCommandInteraction, Client, MessageActionRow, MessageButton, ButtonInteraction, MessageEmbed, AnyChannel, TextChannel, SelectMenuInteraction, Formatters, MessageSelectMenu } from "discord.js";
import { time, userMention } from '@discordjs/builders';
import { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote, hyperlink } from '@discordjs/builders';


import { Command } from "../Command";
import 'dotenv/config'
import { addHours, addMinutes, differenceInMilliseconds, format as dateformat } from 'date-fns'

import { Modal, TextInputComponent, showModal, ModalSubmitInteraction   } from 'discord-modals' // Modal class

import { SlashCommandBuilder } from '@discordjs/builders';

const showReview = async (client: Client, interaction: BaseCommandInteraction): Promise<boolean> =>  {
    //integer = interaction.options.getInteger('int');
    //Create the embed and buttons
    const giveawayEmbed = getEmbeds(0);
    const giveawayButtons = getButtons();
    await interaction.followUp({components: [giveawayButtons], embeds: [giveawayEmbed] });
    return true;
}

const getButtons = (): MessageActionRow => {
    let row = new MessageActionRow()
    
    row.addComponents(
        new MessageButton()
            .setCustomId('upvote')
            .setLabel('Upvote!')
            .setStyle('SUCCESS'),
    )

    row.addComponents(
        new MessageButton()
            .setCustomId('downvote')
            .setLabel('Downvote!')
            .setStyle('DANGER'),
    )

    //TODO verify the link if it is valid HTTPS link
    row.addComponents(
        new MessageButton()
        .setURL("https://discord.com")
        .setLabel("Link to Discord")
        .setStyle('LINK'),
    );

    return row;
}

const getEmbeds = (version: number): MessageEmbed => {
    let embed: MessageEmbed = new MessageEmbed();


    const date = new Date(2022, 5, 2, 20, 0);
    //dateformat(new Date(2022, 1, 11), 'MM/dd/yyyy');
    if(version == 1){
        embed
        .setURL('https://discord.js.org/')
        .setAuthor({ name: 'Frozone .AI', iconURL: 'https://cdn.logojoy.com/wp-content/uploads/20210422095037/discord-mascot.png', url: 'https://discord.js.org' })
        .setDescription('Communi3 Project Review')
        .setThumbnail('https://cdn.logojoy.com/wp-content/uploads/20210422095037/discord-mascot.png')
        .setFooter({ text: 'Project review', iconURL: 'https://cdn.logojoy.com/wp-content/uploads/20210422095037/discord-mascot.png' })
        .addFields(
            { 
                name: 'Date & Time', 
                value: blockQuote('May 2nd'), 
                inline: true 
            },
            { 
                name: 'Mint Price:', 
                value: blockQuote('2 SOL  / $100K USD for a Laboratory'), 
                inline: true 
            },
            { 
                name: 'Total Supply:', 
                value: blockQuote('5001 Mad Scientist / 50 Laboratories'), 
                inline: true 
            },
            { 
                name: 'Project Socials:', 
                value: blockQuote(`Twitter - https://twitter.com/communi3_io\r
                Discord - https://discord.gg/Z6rnNcHH \r
                Website - https://nft.communi3.io/`) },
            { 
                name: 'Project Overview by - Frozone aka Mr. Iceeeyy Jpeglerrr:', 
                value: quote('Communi3 first appeared on twitter March 8th. They have built a lot of hype since then. The team have been building the software for 3 years before their official social media presence appeared. Conviction Level - High🟢 . Reasoning Below,' )},
            { 
                name: 'What is Communi3?', 
                value: quote(`Communi3 is a software that has been in development for 3 years that helps you build engaged communities, prefect in the NFT space. The software allows you to track intricate parts of your community/project i.e. token accumulation. In the words of Brandon Byrne (CEO of Communi3) 'Communi3 wants to lay the track down for NFT projects, blockchain games, Dapps and metaverses to function in a global business environment.' Communi3 is a NFT project that wants to accelerate the adoption of NFTs as a business medium. A lot of those that doubt NFTs and WEB3 as a concept will find it harder to doubt with software that is so well-rounded. ` )
            },
            { 
                name: 'Has the Software been tested?', 
                value: `Communi3 have already been beta-testing this software with a client called, Secret Network, which is working on a privacy blockchain. They have been consistently testing and building with clients to have the software oven-ready for other projects which may want to use their suite. ` 
            },
            { 
                name: `The difference between Mad Scientists and Laboratories`, 
                value: `Communi3 have already been beta-testing this software with a client called, Secret Network, which is working on a privacy blockchain. They have been consistently testing and building with clients to have the software oven-ready for other projects which may want to use their suite. ` 
            },
            {
                name: 'Mad Scientists',
                value: `Mad Scientists will get earn $SCI token overtime, which is a deflationary token integral to the Communi3 ecosystem. \r
                - Each instance of Communi3 will burn a small portion of $SCI\r
                - Every customer onboarded will need to burn a portion of $SCI\r
                - Future features will require burning of $SCI on a monthly basis\r
                - Other clients using Communi3 will need to burn $SCI\r
                - WL priority for all partners\r
                \r
                Mad Scientists are the business to consumer part of the Communi3 business. Ensuring that holders are consistently rewarded for holding and giving them a gateway into the Communi3 ecosystem.`,
                inline: true,
            },
            {
                name: 'Laboratories',
                value: `There will be 50 laboratories minted, each laboratory will be tied clients. There will be more laboratories than customers to support them. Communi3 costs between 5-15K a month and each laboratory will represent 5K worth of services.
    
                A laboratory can be staked and the holder will receive the monthly SAAS fee associated with that Communi3 instance. To put this into context if you 'rent' 3 Labs, to a client the monthly SAAS fee would be the holders ever month, the NFT value is tied directly to the Communi3 ecosystem.`,
                inline: true,
            },
            {
                name: 'Tokenomics ',
                value: `- Token will IDO in 2023. The maximum allocation will be 1B $SCI. Breakdown of IDO is in the picture attached\r
                - 50% of the funds will be for technology, the other 50% will be spent on the marketing, community and operations.`,
            },
    
        )
        .setColor('#123456')
        .setTitle('Communi3 Project Review')
    } else{
        embed
        .setURL('https://discord.js.org/')
        .setAuthor({ name: 'Frozone .AI', iconURL: 'https://cdn.discordapp.com/attachments/974643639177326615/976849912111169576/cets_tab.png', url: 'https://discord.js.org' })
        .setDescription('Communi3 Project Review')
        .setThumbnail('https://cdn.discordapp.com/attachments/974643639177326615/976849912111169576/cets_tab.png')
        .setFooter({ text: 'Project review', iconURL: 'https://cdn.discordapp.com/attachments/974643639177326615/976849912111169576/cets_tab.png' })
        .addFields(
            { 
                name: 'Date & Time', 
                value: time(date, 'D') + "\r" + time(date, 't'), 
                inline: true 
            },
            { 
                name: 'Mint Price:', 
                value: blockQuote('2 SOL  / _$100K_ USD for a Laboratory'), 
                inline: true 
            },
            { 
                name: 'Total Supply:', 
                value: blockQuote('5001 Mad Scientist / 50 Laboratories'), 
                inline: true 
            },
            { 
                name: 'Project Socials:', 
                value: blockQuote(`Twitter - https://twitter.com/communi3_io\r
                Discord - https://discord.gg/Z6rnNcHH \r
                Website - https://nft.communi3.io/`) },
            { 
                name: 'Project Overview by - Frozone aka Mr. Iceeeyy Jpeglerrr:', 
                value: quote('Communi3 first appeared on twitter March 8th. They have built a lot of hype since then. The team have been building the software for 3 years before their official social media presence appeared. Conviction Level - High🟢 . Reasoning Below,' )},
            { 
                name: 'What is Communi3?', 
                value: quote(`Communi3 is a software that has been in development for 3 years that helps you build engaged communities, prefect in the NFT space. The software allows you to track intricate parts of your community/project i.e. token accumulation. In the words of Brandon Byrne (CEO of Communi3) 'Communi3 wants to lay the track down for NFT projects, blockchain games, Dapps and metaverses to function in a global business environment.' Communi3 is a NFT project that wants to accelerate the adoption of NFTs as a business medium. A lot of those that doubt NFTs and WEB3 as a concept will find it harder to doubt with software that is so well-rounded. ` )
            },
            { 
                name: 'Upvotes', 
                value: '10',
                inline: true
            },
            { 
                name: 'Downvotes', 
                value: '5',
                inline: true
            },
            { 
                name: 'What is Communi3?', 
                value: hyperlink(`Click here to read more`, 'https://google.com' )
            },    
        )
        .setColor('#123456')
        .setTitle('Communi3 Project Review')
    }
    

    return embed;
}

const command = new SlashCommandBuilder()
.setName('new_review')
.setDescription("Create new review")
.addNumberOption(option =>
    option.setName('type')
        .setDescription('The input to echo back')
        .setRequired(true));

        /*    options: [
        {
            name: "subcommand1",
            type: "SUB_COMMAND",
            description: "desc here",
        },
    ],*/

export const ReviewCMD: Command = {
    name: "new_review",
    description: "Create new review",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {  
        await interaction.deferReply();      
        showReview(client, interaction);
    }
}