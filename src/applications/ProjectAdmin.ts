import { BaseCommandInteraction, Client, MessageActionRow, MessageButton, ButtonInteraction, MessageEmbed, AnyChannel, TextChannel, SelectMenuInteraction, Formatters, MessageSelectMenu } from "discord.js";
import { time, userMention } from '@discordjs/builders';
import { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote, hyperlink } from '@discordjs/builders';
import { Command } from "../Command";
import 'dotenv/config'
import { Modal, TextInputComponent, showModal, ModalSubmitInteraction  } from 'discord-modals' // Modal class

import axios from "axios";
import { DisplayProject } from "./ShowProject";

const FIELD_TEXT_PROJECT_NAME = 'modal-text-project-name'; 
const FIELD_TEXT_DESCRIPTION = 'modal-text-description';
const FIELD_MINT_DATE = 'modal-text-mint-date';
const FIELD_MINT_TIME = 'modal-text-mint-time';
const FIELD_MINT_PRICE = 'modal-text-mint-price';
const FIELD_PROJECT_ID = 'modal-text-project-id';
const FIELD_MINT_SUPPLY = 'modal-text-mint-supply';
export const MODAL_NEW_PROJECT = 'modal-project';
export const MODAL_ADD_MINTDATE = 'modal-add-mintdate';
export const MODAL_ADD_LINKS = 'modal-add-links';
export const BTN_CREATE_MINTDATE = 'btn-create-mintdate';
export const BTN_SHOW_PROJECT_UPDATE = 'btn-show-project-update';


export interface IReview {
    _id: string;
    //Rest is not needed for the bot
}
    
export interface IMintDetails {
    _id?: string;
    date: Date;
    description: string;
    price: number;
    token_based: boolean;
    supply: number;
}
    
export interface ILinks {
    description: string;
    uri: string;
    type: number;
}
    
export interface IDiscordLocation {
    messageId: string;
    channelId: string;
}
    
export interface IVote {
    upvote: boolean;
    discord_id: string;
}

export interface IProject {
    _id?: string;
    mints: IMintDetails[];
    description: string;
    name: string;
    reporter_discord_id: string;
    links: ILinks[];
    reviews: IReview[];
    discordLocations: IDiscordLocation[];
    votes: IVote[];
    whitelistRoleId?: string;
    discordServerId?: string;
    supply?: Number;
    imageURI?: string;
    whitelistToken?: string;
}

export interface ProjectSummary {
    _id?: string;
    mints: IMintDetails[];
    description: string;
    name: string;
    links: ILinks[];
    review_ids: string[];
    upvotes: number;
    downvotes: number;
    whitelistRoleId?: string;
    discordServerId?: string;
    supply?: Number;
    imageURI?: string;
    whitelistToken?: string;
}