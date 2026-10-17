import { TopicData } from "../../types/content";
import { dataAndDatabasesOverviewContent } from "./01-data-and-databases/00-overview";
import { whyNotSpreadsheetsContent } from "./01-data-and-databases/01-why-not-spreadsheets";
import { whatIsADatabaseContent } from "./01-data-and-databases/02-what-is-a-database";
import { kindsOfDatabasesContent } from "./01-data-and-databases/03-kinds-of-databases";
import { relationalModelContent } from "./01-data-and-databases/04-relational-model";
import { whatIsSqlContent } from "./01-data-and-databases/05-what-is-sql";
import { appDatabaseConversationContent } from "./01-data-and-databases/06-app-database-conversation";
import { oltpVsOlapContent } from "./01-data-and-databases/07-oltp-vs-olap";
import { sqlSetupOverviewContent } from "./02-sql-setup/00-overview";
import { installPostgresqlContent } from "./02-sql-setup/01-install-postgresql";
import { installMysqlContent } from "./02-sql-setup/02-install-mysql";
import { psqlBasicsContent } from "./02-sql-setup/03-psql-basics";
import { guiClientsContent } from "./02-sql-setup/04-gui-clients";
import { databasesSchemasContent } from "./02-sql-setup/05-databases-schemas";
import { loadSampleDatabaseContent } from "./02-sql-setup/06-load-sample-database";
import { errorsAndHelpContent } from "./02-sql-setup/07-errors-and-help";
import { readingDataOverviewContent } from "./03-reading-data/00-overview";
import { selectFromContent } from "./03-reading-data/01-select-from";
import { queryOrderContent } from "./03-reading-data/02-query-order";
import { whereFiltersContent } from "./03-reading-data/03-where-filters";
import { inBetweenLikeContent } from "./03-reading-data/04-in-between-like";
import { nullLogicContent } from "./03-reading-data/05-null-logic";
import { orderByContent } from "./03-reading-data/06-order-by";
import { limitPaginationContent } from "./03-reading-data/07-limit-pagination";
import { distinctContent } from "./03-reading-data/08-distinct";
import { caseExpressionContent } from "./03-reading-data/09-case-expression";

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

    // Module 02: Setup & Tools
    "sql-setup-overview": sqlSetupOverviewContent,
    "install-postgresql": installPostgresqlContent,
    "install-mysql": installMysqlContent,
    "psql-basics": psqlBasicsContent,
    "gui-clients": guiClientsContent,
    "databases-schemas": databasesSchemasContent,
    "load-sample-database": loadSampleDatabaseContent,
    "errors-and-help": errorsAndHelpContent,

    // Module 03: Reading Data
    "reading-data-overview": readingDataOverviewContent,
    "select-from": selectFromContent,
    "query-order": queryOrderContent,
    "where-filters": whereFiltersContent,
    "in-between-like": inBetweenLikeContent,
    "null-logic": nullLogicContent,
    "order-by": orderByContent,
    "limit-pagination": limitPaginationContent,
    "distinct": distinctContent,
    "case-expression": caseExpressionContent,
};
