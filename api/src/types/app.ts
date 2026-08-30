/* 
	Follows data structure in the UC OSPO parquet file
	Created with echo and the output of a quick script that reads the parquet column names and
	convert each from snake_case to camelCase. Manually updated non-string fields' types
		echo -e "export type parquetData = {\n$(npx tsx ./api/src/parqToType.ts)\n};" >> src/types/app.ts
*/

export type parquetData = {
	university: string;
	id: number;
	fullName: string;
	owner: string;
	license: string;
	language: string;
	htmlUrl: string;
	description: string;
	fork: number;
	createdAt: string;
	updatedAt: string;
	pushedAt: string;
	homepage: string;
	size: number;
	stargazersCount: number;
	readme: string;
	watchersCount: number;
	forksCount: number;
	openIssuesCount: number;
	watchers: string;
	organization: string;
	releaseDownloads: number;
	contributors: string;
	contributorCount: number;
	busFactor: number;
	codeOfConductFile: string;
	contributing: string;
	securityPolicy: string;
	issueTemplates: string;
	pullRequestTemplate: string;
	subscribersCount: number;
	affiliationPredictionGpt5Mini: number;
	typePredictionGpt5Mini: string;
};
