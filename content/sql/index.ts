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
import { functionsExpressionsOverviewContent } from "./04-functions-expressions/00-overview";
import { stringFunctionsContent } from "./04-functions-expressions/01-string-functions";
import { numericFunctionsContent } from "./04-functions-expressions/02-numeric-functions";
import { dateTimeFunctionsContent } from "./04-functions-expressions/03-date-time-functions";
import { typeCastingContent } from "./04-functions-expressions/04-type-casting";
import { nullFunctionsContent } from "./04-functions-expressions/05-null-functions";
import { regularExpressionsContent } from "./04-functions-expressions/06-regular-expressions";
import { aggregationGroupingOverviewContent } from "./05-aggregation-grouping/00-overview";
import { aggregateFunctionsContent } from "./05-aggregation-grouping/01-aggregate-functions";
import { groupByContent } from "./05-aggregation-grouping/02-group-by";
import { havingVsWhereContent } from "./05-aggregation-grouping/03-having-vs-where";
import { conditionalAggregationContent } from "./05-aggregation-grouping/04-conditional-aggregation";
import { rollupCubeContent } from "./05-aggregation-grouping/05-rollup-cube";
import { stringArrayAggContent } from "./05-aggregation-grouping/06-string-array-agg";
import { joinsOverviewContent } from "./06-joins/00-overview";
import { whySplitTablesContent } from "./06-joins/01-why-split-tables";
import { innerJoinContent } from "./06-joins/02-inner-join";
import { leftRightJoinContent } from "./06-joins/03-left-right-join";
import { fullOuterJoinContent } from "./06-joins/04-full-outer-join";
import { crossJoinContent } from "./06-joins/05-cross-join";
import { selfJoinContent } from "./06-joins/06-self-join";
import { multiTableJoinsContent } from "./06-joins/07-multi-table-joins";
import { semiAntiJoinContent } from "./06-joins/08-semi-anti-join";
import { lateralJoinContent } from "./06-joins/09-lateral-join";
import { subqueriesCtesOverviewContent } from "./07-subqueries-ctes/00-overview";
import { scalarSubqueriesContent } from "./07-subqueries-ctes/01-scalar-subqueries";
import { inExistsAnyAllContent } from "./07-subqueries-ctes/02-in-exists-any-all";
import { correlatedSubqueriesContent } from "./07-subqueries-ctes/03-correlated-subqueries";
import { derivedTablesContent } from "./07-subqueries-ctes/04-derived-tables";
import { ctesContent } from "./07-subqueries-ctes/05-ctes";
import { recursiveCtesContent } from "./07-subqueries-ctes/06-recursive-ctes";
import { setOperationsContent } from "./07-subqueries-ctes/07-set-operations";

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

    // Module 04: Functions & Expressions
    "functions-expressions-overview": functionsExpressionsOverviewContent,
    "string-functions": stringFunctionsContent,
    "numeric-functions": numericFunctionsContent,
    "date-time-functions": dateTimeFunctionsContent,
    "type-casting": typeCastingContent,
    "null-functions": nullFunctionsContent,
    "regular-expressions": regularExpressionsContent,

    // Module 05: Aggregation & Grouping
    "aggregation-grouping-overview": aggregationGroupingOverviewContent,
    "aggregate-functions": aggregateFunctionsContent,
    "group-by": groupByContent,
    "having-vs-where": havingVsWhereContent,
    "conditional-aggregation": conditionalAggregationContent,
    "rollup-cube": rollupCubeContent,
    "string-array-agg": stringArrayAggContent,

    // Module 06: Joins
    "joins-overview": joinsOverviewContent,
    "why-split-tables": whySplitTablesContent,
    "inner-join": innerJoinContent,
    "left-right-join": leftRightJoinContent,
    "full-outer-join": fullOuterJoinContent,
    "cross-join": crossJoinContent,
    "self-join": selfJoinContent,
    "multi-table-joins": multiTableJoinsContent,
    "semi-anti-join": semiAntiJoinContent,
    "lateral-join": lateralJoinContent,

    // Module 07: Subqueries, CTEs & Set Operations
    "subqueries-ctes-overview": subqueriesCtesOverviewContent,
    "scalar-subqueries": scalarSubqueriesContent,
    "in-exists-any-all": inExistsAnyAllContent,
    "correlated-subqueries": correlatedSubqueriesContent,
    "derived-tables": derivedTablesContent,
    "ctes": ctesContent,
    "recursive-ctes": recursiveCtesContent,
    "set-operations": setOperationsContent,
};
