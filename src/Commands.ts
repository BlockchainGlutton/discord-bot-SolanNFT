import { Command } from "./Command";
import { ReviewCMD } from "./applications/Review";
import { ShowProjectCMD } from "./applications/ShowProject";
import { ShowCalendarCMD } from "./applications/ShowMintcalendar";

export const Commands: Command[] = [ShowProjectCMD, ShowCalendarCMD];