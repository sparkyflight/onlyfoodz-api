
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  detectRuntime,
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.8.1
 * Query Engine version: 78caf6feeaed953168c64e15a249c3e9a033ebe2
 */
Prisma.prismaVersion = {
  client: "5.8.1",
  engine: "78caf6feeaed953168c64e15a249c3e9a033ebe2"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.Bot_commandsScalarFieldEnum = {
  id: 'id',
  bot_id: 'bot_id',
  cmd_type: 'cmd_type',
  groups: 'groups',
  name: 'name',
  vote_locked: 'vote_locked',
  description: 'description',
  args: 'args',
  examples: 'examples',
  premium_only: 'premium_only',
  notes: 'notes',
  doc_link: 'doc_link',
  nsfw: 'nsfw',
  lynxtag: 'lynxtag'
};

exports.Prisma.Bot_eventsScalarFieldEnum = {
  bot_id: 'bot_id',
  event_type: 'event_type',
  ts: 'ts',
  reason: 'reason',
  css: 'css',
  id: 'id',
  lynxtag: 'lynxtag'
};

exports.Prisma.Bot_list_featureScalarFieldEnum = {
  feature_id: 'feature_id',
  name: 'name',
  iname: 'iname',
  description: 'description',
  positive: 'positive',
  lynxtag: 'lynxtag'
};

exports.Prisma.Bot_list_tagsScalarFieldEnum = {
  id: 'id',
  icon: 'icon',
  lynxtag: 'lynxtag'
};

exports.Prisma.Bot_ownerScalarFieldEnum = {
  bot_id: 'bot_id',
  owner: 'owner',
  main: 'main',
  id: 'id',
  lynxtag: 'lynxtag'
};

exports.Prisma.Bot_packsScalarFieldEnum = {
  id: 'id',
  icon: 'icon',
  banner: 'banner',
  owner: 'owner',
  bots: 'bots',
  description: 'description',
  name: 'name',
  created_at: 'created_at',
  lynxtag: 'lynxtag'
};

exports.Prisma.Bot_promotionsScalarFieldEnum = {
  id: 'id',
  bot_id: 'bot_id',
  title: 'title',
  info: 'info',
  css: 'css',
  type: 'type',
  lynxtag: 'lynxtag'
};

exports.Prisma.Bot_stats_votes_pmScalarFieldEnum = {
  bot_id: 'bot_id',
  votes: 'votes',
  epoch: 'epoch',
  lynxtag: 'lynxtag'
};

exports.Prisma.Bot_tagsScalarFieldEnum = {
  bot_id: 'bot_id',
  tag: 'tag',
  id: 'id',
  lynxtag: 'lynxtag'
};

exports.Prisma.Bot_votersScalarFieldEnum = {
  bot_id: 'bot_id',
  user_id: 'user_id',
  timestamps: 'timestamps',
  lynxtag: 'lynxtag'
};

exports.Prisma.BotsScalarFieldEnum = {
  bot_id: 'bot_id',
  votes: 'votes',
  guild_count: 'guild_count',
  shard_count: 'shard_count',
  bot_library: 'bot_library',
  webhook: 'webhook',
  description: 'description',
  long_description: 'long_description',
  prefix: 'prefix',
  api_token: 'api_token',
  banner_card: 'banner_card',
  created_at: 'created_at',
  invite: 'invite',
  features: 'features',
  invite_amount: 'invite_amount',
  user_count: 'user_count',
  css: 'css',
  shards: 'shards',
  username_cached: 'username_cached',
  state: 'state',
  long_description_type: 'long_description_type',
  verifier: 'verifier',
  last_stats_post: 'last_stats_post',
  webhook_secret: 'webhook_secret',
  webhook_type: 'webhook_type',
  di_text: 'di_text',
  id: 'id',
  banner_page: 'banner_page',
  total_votes: 'total_votes',
  client_id: 'client_id',
  flags: 'flags',
  uptime_checks_total: 'uptime_checks_total',
  uptime_checks_failed: 'uptime_checks_failed',
  page_style: 'page_style',
  webhook_hmac_only: 'webhook_hmac_only',
  last_updated_at: 'last_updated_at',
  avatar_cached: 'avatar_cached',
  disc_cached: 'disc_cached',
  extra_links: 'extra_links',
  lynxtag: 'lynxtag'
};

exports.Prisma.Extra_dataScalarFieldEnum = {
  name: 'name',
  value: 'value',
  user_id: 'user_id',
  lynxtag: 'lynxtag'
};

exports.Prisma.FeaturesScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  viewed_as: 'viewed_as',
  lynxtag: 'lynxtag'
};

exports.Prisma.Frostpaw_clientsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  domain: 'domain',
  privacy_policy: 'privacy_policy',
  secret: 'secret',
  owner_id: 'owner_id',
  lynxtag: 'lynxtag',
  verified: 'verified'
};

exports.Prisma.Leave_of_absenceScalarFieldEnum = {
  reason: 'reason',
  start_date: 'start_date',
  user_id: 'user_id',
  id: 'id',
  lynxtag: 'lynxtag'
};

exports.Prisma.Lynx_appsScalarFieldEnum = {
  user_id: 'user_id',
  app_id: 'app_id',
  questions: 'questions',
  answers: 'answers',
  app_version: 'app_version',
  created_at: 'created_at',
  lynxtag: 'lynxtag'
};

exports.Prisma.Lynx_dataScalarFieldEnum = {
  default_user_experiments: 'default_user_experiments',
  id: 'id',
  lynxtag: 'lynxtag'
};

exports.Prisma.Lynx_logsScalarFieldEnum = {
  user_id: 'user_id',
  method: 'method',
  url: 'url',
  status_code: 'status_code',
  request_time: 'request_time',
  lynxtag: 'lynxtag'
};

exports.Prisma.Lynx_notificationsScalarFieldEnum = {
  acked_users: 'acked_users',
  message: 'message',
  type: 'type',
  id: 'id',
  staff_only: 'staff_only',
  lynxtag: 'lynxtag'
};

exports.Prisma.Lynx_ratingsScalarFieldEnum = {
  id: 'id',
  feedback: 'feedback',
  username_cached: 'username_cached',
  user_id: 'user_id',
  page: 'page',
  lynxtag: 'lynxtag'
};

exports.Prisma.Lynx_survey_responsesScalarFieldEnum = {
  id: 'id',
  questions: 'questions',
  answers: 'answers',
  username_cached: 'username_cached',
  user_id: 'user_id',
  survey_id: 'survey_id',
  lynxtag: 'lynxtag'
};

exports.Prisma.Lynx_surveysScalarFieldEnum = {
  id: 'id',
  title: 'title',
  questions: 'questions',
  created_at: 'created_at',
  lynxtag: 'lynxtag'
};

exports.Prisma.MigrationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  app_name: 'app_name',
  ran_on: 'ran_on',
  lynxtag: 'lynxtag'
};

exports.Prisma.Piccolo_userScalarFieldEnum = {
  id: 'id',
  username: 'username',
  password: 'password',
  email: 'email',
  active: 'active',
  admin: 'admin',
  first_name: 'first_name',
  last_name: 'last_name',
  superuser: 'superuser',
  last_login: 'last_login',
  lynxtag: 'lynxtag'
};

exports.Prisma.Platform_mapScalarFieldEnum = {
  fates_id: 'fates_id',
  platform_id: 'platform_id',
  lynxtag: 'lynxtag'
};

exports.Prisma.Push_notificationsScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  token: 'token'
};

exports.Prisma.Review_votesScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  upvote: 'upvote',
  lynxtag: 'lynxtag'
};

exports.Prisma.ReviewsScalarFieldEnum = {
  id: 'id',
  target_id: 'target_id',
  user_id: 'user_id',
  star_rating: 'star_rating',
  review_text: 'review_text',
  flagged: 'flagged',
  epoch: 'epoch',
  target_type: 'target_type',
  parent_id: 'parent_id',
  lynxtag: 'lynxtag'
};

exports.Prisma.Server_audit_logsScalarFieldEnum = {
  guild_id: 'guild_id',
  user_id: 'user_id',
  username: 'username',
  user_guild_perms: 'user_guild_perms',
  field: 'field',
  value: 'value',
  action_time: 'action_time',
  action_id: 'action_id',
  lynxtag: 'lynxtag'
};

exports.Prisma.Server_tagsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  owner_guild: 'owner_guild',
  iconify_data: 'iconify_data',
  lynxtag: 'lynxtag'
};

exports.Prisma.Server_votersScalarFieldEnum = {
  guild_id: 'guild_id',
  user_id: 'user_id',
  timestamps: 'timestamps',
  lynxtag: 'lynxtag'
};

exports.Prisma.ServersScalarFieldEnum = {
  guild_id: 'guild_id',
  votes: 'votes',
  webhook: 'webhook',
  description: 'description',
  long_description: 'long_description',
  css: 'css',
  api_token: 'api_token',
  invite_amount: 'invite_amount',
  invite_url: 'invite_url',
  name_cached: 'name_cached',
  long_description_type: 'long_description_type',
  state: 'state',
  created_at: 'created_at',
  avatar_cached: 'avatar_cached',
  invite_channel: 'invite_channel',
  guild_count: 'guild_count',
  banner_card: 'banner_card',
  banner_page: 'banner_page',
  webhook_secret: 'webhook_secret',
  webhook_type: 'webhook_type',
  total_votes: 'total_votes',
  tags: 'tags',
  owner_id: 'owner_id',
  flags: 'flags',
  autorole_votes: 'autorole_votes',
  whitelist_form: 'whitelist_form',
  webhook_hmac_only: 'webhook_hmac_only',
  old_state: 'old_state',
  user_whitelist: 'user_whitelist',
  user_blacklist: 'user_blacklist',
  extra_links: 'extra_links',
  lynxtag: 'lynxtag'
};

exports.Prisma.SessionsScalarFieldEnum = {
  id: 'id',
  token: 'token',
  user_id: 'user_id',
  expiry_date: 'expiry_date',
  max_expiry_date: 'max_expiry_date',
  lynxtag: 'lynxtag'
};

exports.Prisma.User_bot_logsScalarFieldEnum = {
  user_id: 'user_id',
  bot_id: 'bot_id',
  action_time: 'action_time',
  action: 'action',
  context: 'context',
  lynxtag: 'lynxtag'
};

exports.Prisma.User_connectionsScalarFieldEnum = {
  user_id: 'user_id',
  client_id: 'client_id',
  refresh_token: 'refresh_token',
  expires_on: 'expires_on',
  lynxtag: 'lynxtag'
};

exports.Prisma.User_server_vote_tableScalarFieldEnum = {
  user_id: 'user_id',
  guild_id: 'guild_id',
  expires_on: 'expires_on',
  lynxtag: 'lynxtag'
};

exports.Prisma.User_vote_tableScalarFieldEnum = {
  user_id: 'user_id',
  bot_id: 'bot_id',
  expires_on: 'expires_on',
  lynxtag: 'lynxtag'
};

exports.Prisma.UsersScalarFieldEnum = {
  user_id: 'user_id',
  api_token: 'api_token',
  description: 'description',
  badges: 'badges',
  username: 'username',
  user_css: 'user_css',
  state: 'state',
  coins: 'coins',
  id: 'id',
  site_lang: 'site_lang',
  profile_css: 'profile_css',
  vote_reminders: 'vote_reminders',
  vote_reminder_channel: 'vote_reminder_channel',
  staff_verify_code: 'staff_verify_code',
  vote_reminders_last_acked: 'vote_reminders_last_acked',
  vote_reminders_servers: 'vote_reminders_servers',
  vote_reminders_servers_last_acked: 'vote_reminders_servers_last_acked',
  vote_reminder_servers_channel: 'vote_reminder_servers_channel',
  experiments: 'experiments',
  flags: 'flags',
  extra_links: 'extra_links',
  supabase_id: 'supabase_id',
  totp_shared_key: 'totp_shared_key',
  staff_password: 'staff_password',
  lynxtag: 'lynxtag'
};

exports.Prisma.VanityScalarFieldEnum = {
  type: 'type',
  vanity_url: 'vanity_url',
  redirect: 'redirect',
  lynxtag: 'lynxtag'
};

exports.Prisma.Ws_eventsScalarFieldEnum = {
  id: 'id',
  type: 'type',
  ts: 'ts',
  event: 'event',
  lynxtag: 'lynxtag'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  bot_commands: 'bot_commands',
  bot_events: 'bot_events',
  bot_list_feature: 'bot_list_feature',
  bot_list_tags: 'bot_list_tags',
  bot_owner: 'bot_owner',
  bot_packs: 'bot_packs',
  bot_promotions: 'bot_promotions',
  bot_stats_votes_pm: 'bot_stats_votes_pm',
  bot_tags: 'bot_tags',
  bot_voters: 'bot_voters',
  bots: 'bots',
  extra_data: 'extra_data',
  features: 'features',
  frostpaw_clients: 'frostpaw_clients',
  leave_of_absence: 'leave_of_absence',
  lynx_apps: 'lynx_apps',
  lynx_data: 'lynx_data',
  lynx_logs: 'lynx_logs',
  lynx_notifications: 'lynx_notifications',
  lynx_ratings: 'lynx_ratings',
  lynx_survey_responses: 'lynx_survey_responses',
  lynx_surveys: 'lynx_surveys',
  migration: 'migration',
  piccolo_user: 'piccolo_user',
  platform_map: 'platform_map',
  push_notifications: 'push_notifications',
  review_votes: 'review_votes',
  reviews: 'reviews',
  server_audit_logs: 'server_audit_logs',
  server_tags: 'server_tags',
  server_voters: 'server_voters',
  servers: 'servers',
  sessions: 'sessions',
  user_bot_logs: 'user_bot_logs',
  user_connections: 'user_connections',
  user_server_vote_table: 'user_server_vote_table',
  user_vote_table: 'user_vote_table',
  users: 'users',
  vanity: 'vanity',
  ws_events: 'ws_events'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        const runtime = detectRuntime()
        const edgeRuntimeName = {
          'workerd': 'Cloudflare Workers',
          'deno': 'Deno and Deno Deploy',
          'netlify': 'Netlify Edge Functions',
          'edge-light': 'Vercel Edge Functions',
        }[runtime]

        let message = 'PrismaClient is unable to run in '
        if (edgeRuntimeName !== undefined) {
          message += edgeRuntimeName + '. As an alternative, try Accelerate: https://pris.ly/d/accelerate.'
        } else {
          message += 'this browser environment, or has been bundled for the browser (running in `' + runtime + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://github.com/prisma/prisma/issues`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
