export interface bot_commands {
    id: string,
    bot_id: number,
    cmd_type: number,
    groups: string[],
    name: string,
    vote_locked: boolean,
    description: string,
    args: string[],
    examples: string[],
    premium_only: boolean,
    notes: string[],
    doc_link?: string,
    nsfw?: boolean,
    lynxtag: string,
    bots: bots,
}

export interface bot_events {
    bot_id: number,
    event_type: number,
    ts: Date,
    reason: string,
    css: string,
    id: string,
    lynxtag: string,
    bots: bots,
}

export interface bot_list_feature {
    feature_id: number,
    name: string,
    iname: string,
    description?: string,
    positive?: number,
    lynxtag: string,
}

export interface bot_list_tags {
    id: string,
    icon: string,
    lynxtag: string,
    bot_tags: bot_tags[],
}

export interface bot_owner {
    bot_id: number,
    owner: number,
    main?: boolean,
    id: number,
    lynxtag: string,
    bots: bots,
}

export interface bot_packs {
    id: string,
    icon?: string,
    banner?: string,
    owner: number,
    bots: number[],
    description: string,
    name: string,
    created_at?: Date,
    lynxtag: string,
}

export interface bot_promotions {
    id: string,
    bot_id?: number,
    title?: string,
    info?: string,
    css?: string,
    type?: number,
    lynxtag: string,
    bots?: bots,
}

export interface bot_stats_votes_pm {
    bot_id?: number,
    votes?: number,
    epoch?: number,
    lynxtag: string,
}

export interface bot_tags {
    bot_id: number,
    tag: string,
    id: number,
    lynxtag: string,
    bots: bots,
    bot_list_tags: bot_list_tags,
}

export interface bot_voters {
    bot_id: number,
    user_id: number,
    timestamps: Date[],
    lynxtag: string,
    users: users,
}

export interface bots {
    bot_id: number,
    votes?: number,
    guild_count?: number,
    shard_count?: number,
    bot_library?: string,
    webhook?: string,
    description: string,
    long_description: string,
    prefix?: string,
    api_token?: string,
    banner_card?: string,
    created_at: Date,
    invite: string,
    features: string[],
    invite_amount?: number,
    user_count?: number,
    css?: string,
    shards: number[],
    username_cached: string,
    state: number,
    long_description_type: number,
    verifier?: number,
    last_stats_post: Date,
    webhook_secret?: string,
    webhook_type?: number,
    di_text?: string,
    id: number,
    banner_page?: string,
    total_votes?: number,
    client_id?: number,
    flags: number[],
    uptime_checks_total?: number,
    uptime_checks_failed?: number,
    page_style: number,
    webhook_hmac_only?: boolean,
    last_updated_at: Date,
    avatar_cached: string,
    disc_cached: string,
    extra_links: any,
    lynxtag: string,
    bot_commands: bot_commands[],
    bot_events: bot_events[],
    bot_owner: bot_owner[],
    bot_promotions: bot_promotions[],
    bot_tags: bot_tags[],
}

export interface extra_data {
    name?: string,
    value?: any,
    user_id?: number,
    lynxtag: string,
    users?: users,
}

export interface features {
    id: string,
    name: string,
    description: string,
    viewed_as: string,
    lynxtag: string,
}

export interface frostpaw_clients {
    id: string,
    name: string,
    domain: string,
    privacy_policy: string,
    secret: string,
    owner_id: number,
    lynxtag: string,
    verified: boolean,
    users: users,
}

export interface leave_of_absence {
    reason?: string,
    start_date?: Date,
    user_id?: number,
    id: number,
    lynxtag: string,
    users?: users,
}

export interface lynx_apps {
    user_id?: number,
    app_id: string,
    questions?: any,
    answers?: any,
    app_version?: number,
    created_at?: Date,
    lynxtag: string,
    users?: users,
}

export interface lynx_data {
    default_user_experiments: number[],
    id: number,
    lynxtag: string,
}

export interface lynx_logs {
    user_id: number,
    method: string,
    url: string,
    status_code: number,
    request_time?: Date,
    lynxtag: string,
    users: users,
}

export interface lynx_notifications {
    acked_users: number[],
    message: string,
    type: string,
    id: string,
    staff_only?: boolean,
    lynxtag: string,
}

export interface lynx_ratings {
    id: string,
    feedback: string,
    username_cached: string,
    user_id?: number,
    page: string,
    lynxtag: string,
    users?: users,
}

export interface lynx_survey_responses {
    id: string,
    questions: any,
    answers: any,
    username_cached: string,
    user_id?: number,
    survey_id: string,
    lynxtag: string,
    lynx_surveys: lynx_surveys,
    users?: users,
}

export interface lynx_surveys {
    id: string,
    title: string,
    questions: any,
    created_at?: Date,
    lynxtag: string,
    lynx_survey_responses: lynx_survey_responses[],
}

export interface migration {
    id: number,
    name: string,
    app_name: string,
    ran_on: Date,
    lynxtag: string,
}

export interface piccolo_user {
    id: number,
    username: string,
    password: string,
    email: string,
    active: boolean,
    admin: boolean,
    first_name?: string,
    last_name?: string,
    superuser: boolean,
    last_login?: Date,
    lynxtag: string,
}

export interface platform_map {
    fates_id: number,
    platform_id: string,
    lynxtag: string,
}

export interface push_notifications {
    id: string,
    user_id: number,
    token: string,
    users: users,
}

export interface review_votes {
    id: string,
    user_id: number,
    upvote: boolean,
    lynxtag: string,
    reviews: reviews,
    users: users,
}

export interface reviews {
    id: string,
    target_id: number,
    user_id: number,
    star_rating: number,
    review_text: string,
    flagged: boolean,
    epoch: number[],
    target_type?: number,
    parent_id?: string,
    lynxtag: string,
    review_votes: review_votes[],
    reviews?: reviews,
    other_reviews: reviews[],
    users: users,
}

export interface server_audit_logs {
    guild_id: number,
    user_id: number,
    username: string,
    user_guild_perms: string,
    field: string,
    value: string,
    action_time: Date,
    action_id: string,
    lynxtag: string,
    servers: servers,
    users: users,
}

export interface server_tags {
    id: string,
    name: string,
    owner_guild: number,
    iconify_data: string,
    lynxtag: string,
}

export interface server_voters {
    guild_id: number,
    user_id: number,
    timestamps: Date[],
    lynxtag: string,
    users: users,
}

export interface servers {
    guild_id: number,
    votes?: number,
    webhook?: string,
    description: string,
    long_description: string,
    css?: string,
    api_token: string,
    invite_amount?: number,
    invite_url?: string,
    name_cached: string,
    long_description_type?: number,
    state: number,
    created_at: Date,
    avatar_cached?: string,
    invite_channel?: number,
    guild_count?: number,
    banner_card?: string,
    banner_page?: string,
    webhook_secret?: string,
    webhook_type?: number,
    total_votes?: number,
    tags: string[],
    owner_id: number,
    flags: number[],
    autorole_votes: number[],
    whitelist_form?: string,
    webhook_hmac_only?: boolean,
    old_state: number,
    user_whitelist: number[],
    user_blacklist: number[],
    extra_links: any,
    lynxtag: string,
    server_audit_logs: server_audit_logs[],
    users: users,
}

export interface sessions {
    id: number,
    token: string,
    user_id: number,
    expiry_date: Date,
    max_expiry_date: Date,
    lynxtag: string,
}

export interface user_bot_logs {
    user_id: number,
    bot_id: number,
    action_time: Date,
    action: number,
    context?: string,
    lynxtag: string,
    users: users,
}

export interface user_connections {
    user_id: number,
    client_id: string,
    refresh_token: string,
    expires_on: Date,
    lynxtag: string,
    users: users,
}

export interface user_server_vote_table {
    user_id: number,
    guild_id: number,
    expires_on?: Date,
    lynxtag: string,
    users: users,
}

export interface user_vote_table {
    user_id: number,
    bot_id: number,
    expires_on?: Date,
    lynxtag: string,
    users: users,
}

export interface users {
    user_id: number,
    api_token: string,
    description?: string,
    badges: string[],
    username?: string,
    user_css?: string,
    state: number,
    coins?: number,
    id: number,
    site_lang?: string,
    profile_css: string,
    vote_reminders: number[],
    vote_reminder_channel?: number,
    staff_verify_code?: string,
    vote_reminders_last_acked: Date,
    vote_reminders_servers: number[],
    vote_reminders_servers_last_acked: Date,
    vote_reminder_servers_channel?: number,
    experiments: number[],
    flags: number[],
    extra_links: any,
    supabase_id?: string,
    totp_shared_key?: string,
    staff_password?: string,
    lynxtag: string,
    bot_voters: bot_voters[],
    extra_data: extra_data[],
    frostpaw_clients: frostpaw_clients[],
    leave_of_absence: leave_of_absence[],
    lynx_apps: lynx_apps[],
    lynx_logs: lynx_logs[],
    lynx_ratings: lynx_ratings[],
    lynx_survey_responses: lynx_survey_responses[],
    push_notifications: push_notifications[],
    review_votes: review_votes[],
    reviews: reviews[],
    server_audit_logs: server_audit_logs[],
    server_voters: server_voters[],
    servers: servers[],
    user_bot_logs: user_bot_logs[],
    user_connections: user_connections[],
    user_server_vote_table?: user_server_vote_table,
    user_vote_table?: user_vote_table,
}

export interface vanity {
    type?: number,
    vanity_url?: string,
    redirect?: number,
    lynxtag: string,
}

export interface ws_events {
    id: number,
    type: string,
    ts: Date,
    event: any,
    lynxtag: string,
}
