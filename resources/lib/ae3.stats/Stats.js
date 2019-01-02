const Stats = require('ru.myx.ae3.internal/stats/Stats');

module.exports = {
	/**
	 * handleListRuntimeSystemStats(lib, query, clientElementProperties)
	 */
	handleListRuntimeSystemStats : Stats.RuntimeStatsService.handleListRuntimeSystemStats.bind(Stats.RuntimeStatsService),
	/**
	 * listRuntimeSystemStats(start, limit, backwards)
	 */
	listRuntimeSystemStats : Stats.RuntimeStatsService.listRuntimeSystemStats.bind(Stats.RuntimeStatsService),
	/**
	 * listRuntimeSystemStats(start, limit, backwards)
	 */
	validateOrCreateStartKey : Stats.RuntimeStatsService.validateOrCreateStartKey.bind(Stats.RuntimeStatsService),
	/**
	 * getGroups()
	 */
	getGroups : Stats.getGroups.bind(Stats),
	/**
	 * getGroup(name)
	 */
	getGroup : Stats.getGroup.bind(Stats),
};