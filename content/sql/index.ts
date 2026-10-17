import { TopicData } from "../../types/content";
import { dataAndDatabasesOverviewContent } from "./01-data-and-databases/00-overview";
import { whyNotSpreadsheetsContent } from "./01-data-and-databases/01-why-not-spreadsheets";
import { whatIsADatabaseContent } from "./01-data-and-databases/02-what-is-a-database";
import { kindsOfDatabasesContent } from "./01-data-and-databases/03-kinds-of-databases";
import { relationalModelContent } from "./01-data-and-databases/04-relational-model";
import { whatIsSqlContent } from "./01-data-and-databases/05-what-is-sql";
import { appDatabaseConversationContent } from "./01-data-and-databases/06-app-database-conversation";
import { oltpVsOlapContent } from "./01-data-and-databases/07-oltp-vs-olap";

/**
 * Lesson content for the SQL & Database Mastery track.
 *
 * Every lesson page already exists and renders its header, metadata and
 * prev/next navigation from `lib/sql-course-data.ts`. A lesson shows the
 * "Content Coming Soon" placeholder until it gets an entry here.
 *
 * To write a lesson: create `content/sql/<nn>-<module-id>/<nn>-<lesson-id>.tsx`
 * exporting a `TopicData`, import it below and map it to the lesson id used in
 * `lib/sql-course-data.ts`.
 */
export const sqlContentMap: Record<string, TopicData> = {
    // Module 01: Data & Databases
    "data-and-databases-overview": dataAndDatabasesOverviewContent,
    "why-not-spreadsheets": whyNotSpreadsheetsContent,
    "what-is-a-database": whatIsADatabaseContent,
    "kinds-of-databases": kindsOfDatabasesContent,
    "relational-model": relationalModelContent,
    "what-is-sql": whatIsSqlContent,
    "app-database-conversation": appDatabaseConversationContent,
    "oltp-vs-olap": oltpVsOlapContent,
};
