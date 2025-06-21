IF object_id('[dbo].[apm_rev_info]') IS NULL
BEGIN
    CREATE TABLE [dbo].[apm_rev_info](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [timestamp] [bigint] NOT NULL,
        [user_name] [nvarchar](255) NULL,
        CONSTRAINT [PK__apm_rev_info__3213E83F2780429F] PRIMARY KEY CLUSTERED
    (
    [id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]
END

IF object_id('[dbo].[apm_rev_changes]') IS NULL
BEGIN
    CREATE TABLE [dbo].[apm_rev_changes](
        [rev] [int] NOT NULL,
        [entityname] [nvarchar](255) NULL
        ) ON [PRIMARY]

    ALTER TABLE [dbo].[apm_rev_changes]  WITH CHECK ADD  CONSTRAINT [FK_apm_rev_changes__apm_rev_info] FOREIGN KEY([rev])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[apm_rev_changes] CHECK CONSTRAINT [FK_apm_rev_changes__apm_rev_info]
END

IF object_id('[dbo].[account]') IS NULL
BEGIN
CREATE TABLE [dbo].[account](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2] NULL,
    [account_manager] [nvarchar](255) NULL,
    [account_number] [nvarchar](255) NULL,
    [company] [nvarchar](255) NULL,
    [concurrent_user_sessions] [int] NULL,
    [customer_id] [nvarchar](255) NULL,
    [email] [nvarchar](255) NULL,
    [expiry_date] [datetime2](7) NULL,
    [first_name] [nvarchar](255) NULL,
    [last_name] [nvarchar](255) NULL,
    [on_prem] [bit] NULL,
    [schema_name] [nvarchar](255) NULL,
    [server] [nvarchar](255) NULL,
     PRIMARY KEY CLUSTERED
    ([id] ASC) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
        CONSTRAINT [UK_66gkcp94endmotfwb8r4ocxm8] UNIQUE NONCLUSTERED
    ([account_number] ASC) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]

END

IF object_id('[dbo].[account_aud]') IS NULL
BEGIN
    CREATE TABLE [dbo].[account_aud](
        [id] [int] NOT NULL,
        [rev] [int] NOT NULL,
        [revtype] [smallint] NULL,
        [revend] [int] NULL,
        [version] [datetime2] NULL,
        [account_manager] [nvarchar](255) NULL,
        [account_number] [nvarchar](255) NULL,
        [company] [nvarchar](255) NULL,
        [concurrent_user_sessions] [int] NULL,
        [customer_id] [nvarchar](255) NULL,
        [email] [nvarchar](255) NULL,
        [expiry_date] [datetime2](7) NULL,
        [first_name] [nvarchar](255) NULL,
        [last_name] [nvarchar](255) NULL,
        [on_prem] [bit] NULL,
        [schema_name] [nvarchar](255) NULL,
        [server] [nvarchar](255) NULL,
        PRIMARY KEY CLUSTERED
    (
        [id] ASC,
    [rev] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]

    ALTER TABLE [dbo].[account_aud]  WITH CHECK ADD  CONSTRAINT [FK_account_aud_rev__apm_rev_info] FOREIGN KEY([rev])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[account_aud] CHECK CONSTRAINT [FK_account_aud_rev__apm_rev_info]

    ALTER TABLE [dbo].[account_aud]  WITH CHECK ADD  CONSTRAINT [FK_account_aud_revend__apm_rev_info] FOREIGN KEY([revend])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[account_aud] CHECK CONSTRAINT [FK_account_aud_revend__apm_rev_info]
END



IF object_id('[dbo].[on_prem_schema]') IS NULL
BEGIN
    CREATE TABLE [dbo].[on_prem_schema](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [version] [datetime2] NULL,
        [schema_name] [nvarchar](255) NULL,
        [account_id] [int] NULL,
        PRIMARY KEY CLUSTERED
    (
    [id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]

    ALTER TABLE [dbo].[on_prem_schema]  WITH CHECK ADD  CONSTRAINT [FK_on_prem_schema_account_id__account] FOREIGN KEY([account_id])
        REFERENCES [dbo].[account] ([id])

    ALTER TABLE [dbo].[on_prem_schema] CHECK CONSTRAINT [FK_on_prem_schema_account_id__account]
END

IF object_id('[dbo].[on_prem_schema_aud]') IS NULL
BEGIN
    CREATE TABLE [dbo].[on_prem_schema_aud](
        [id] [int] NOT NULL,
        [rev] [int] NOT NULL,
        [revtype] [smallint] NULL,
        [revend] [int] NULL,
        [version] [datetime2] NULL,
        [schema_name] [nvarchar](255) NULL,
        [account_id] [int] NULL,
        PRIMARY KEY CLUSTERED
    (
        [id] ASC,
    [rev] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]

    ALTER TABLE [dbo].[on_prem_schema_aud]  WITH CHECK ADD  CONSTRAINT [FK_on_prem_schema_aud_rev__apm_rev_info] FOREIGN KEY([rev])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[on_prem_schema_aud] CHECK CONSTRAINT [FK_on_prem_schema_aud_rev__apm_rev_info]

    ALTER TABLE [dbo].[on_prem_schema_aud]  WITH CHECK ADD  CONSTRAINT [FK_on_prem_schema_aud_revend__apm_rev_info] FOREIGN KEY([revend])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[on_prem_schema_aud] CHECK CONSTRAINT [FK_on_prem_schema_aud_revend__apm_rev_info]
END

IF object_id('[dbo].[server_info]') IS NULL
BEGIN
    CREATE TABLE [dbo].[server_info](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [version] [datetime2] NULL,
        [backup_id] [nvarchar](255) NULL,
        [date_created] [datetime2](7) NULL,
        [ip] [nvarchar](255) NULL,
        [level] [nvarchar](255) NULL,
        [location] [nvarchar](255) NULL,
        [name] [nvarchar](255) NULL,
        [password] [nvarchar](255) NULL,
        [server_id] [nvarchar](255) NULL,
        [status] [nvarchar](255) NULL,
        [storage] [nvarchar](255) NULL,
        [user_name] [nvarchar](255) NULL,
        PRIMARY KEY CLUSTERED
    (
    [id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
        CONSTRAINT [UK_server_info] UNIQUE NONCLUSTERED
    (
    [name] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]
END

IF object_id('[dbo].[server_info_aud]') IS NULL
BEGIN
    CREATE TABLE [dbo].[server_info_aud](
        [id] [int] NOT NULL,
        [rev] [int] NOT NULL,
        [revtype] [smallint] NULL,
        [revend] [int] NULL,
        [version] [datetime2] NULL,
        [backup_id] [nvarchar](255) NULL,
        [date_created] [datetime2](7) NULL,
        [ip] [nvarchar](255) NULL,
        [level] [nvarchar](255) NULL,
        [location] [nvarchar](255) NULL,
        [name] [nvarchar](255) NULL,
        [password] [nvarchar](255) NULL,
        [server_id] [nvarchar](255) NULL,
        [status] [nvarchar](255) NULL,
        [storage] [nvarchar](255) NULL,
        [user_name] [nvarchar](255) NULL,
        PRIMARY KEY CLUSTERED
    (
        [id] ASC,
    [rev] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]

    ALTER TABLE [dbo].[server_info_aud]  WITH CHECK ADD  CONSTRAINT [FK_server_info_aud_rev__apm_rev_info] FOREIGN KEY([rev])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[server_info_aud] CHECK CONSTRAINT [FK_server_info_aud_rev__apm_rev_info]

    ALTER TABLE [dbo].[server_info_aud]  WITH CHECK ADD  CONSTRAINT [FK_server_info_aud_revend__apm_rev_info] FOREIGN KEY([revend])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[server_info_aud] CHECK CONSTRAINT [FK_server_info_aud_revend__apm_rev_info]
END

IF object_id('[dbo].[subscriptions]') IS NULL
BEGIN
    CREATE TABLE [dbo].[subscriptions](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [version] [datetime2] NULL,
        [is_trial] [bit] NOT NULL,
        [plan_name] [nvarchar](255) NULL,
        [subscription_id] [nvarchar](255) NULL,
        [subscription_started_timestamp] [datetime2](7) NULL,
        [unlimited_users] [bit] NOT NULL,
        [account_id] [int] NULL,
        PRIMARY KEY CLUSTERED
    (
    [id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]

    ALTER TABLE [dbo].[subscriptions] ADD  DEFAULT ((0)) FOR [is_trial]

    ALTER TABLE [dbo].[subscriptions] ADD  DEFAULT ((0)) FOR [unlimited_users]


    ALTER TABLE [dbo].[subscriptions]  WITH CHECK ADD  CONSTRAINT [FK_subscriptions_account_id__account] FOREIGN KEY([account_id])
        REFERENCES [dbo].[account] ([id])

    ALTER TABLE [dbo].[subscriptions] CHECK CONSTRAINT [FK_subscriptions_account_id__account]
END

IF object_id('[dbo].[subscriptions_aud]') IS NULL
BEGIN
    CREATE TABLE [dbo].[subscriptions_aud](
        [id] [int] NOT NULL,
        [rev] [int] NOT NULL,
        [revtype] [smallint] NULL,
        [revend] [int] NULL,
        [version] [datetime2] NULL,
        [is_trial] [bit] NULL,
        [plan_name] [nvarchar](255) NULL,
        [subscription_id] [nvarchar](255) NULL,
        [subscription_started_timestamp] [datetime2](7) NULL,
        [unlimited_users] [bit] NULL,
        [account_id] [int] NULL,
        PRIMARY KEY CLUSTERED
    (
        [id] ASC,
    [rev] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]

    ALTER TABLE [dbo].[subscriptions_aud]  WITH CHECK ADD  CONSTRAINT [FK_subscriptions_aud_rev__apm_rev_info] FOREIGN KEY([rev])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[subscriptions_aud] CHECK CONSTRAINT [FK_subscriptions_aud_rev__apm_rev_info]

    ALTER TABLE [dbo].[subscriptions_aud]  WITH CHECK ADD  CONSTRAINT [FK_subscriptions_aud_revend__apm_rev_info] FOREIGN KEY([revend])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[subscriptions_aud] CHECK CONSTRAINT [FK_subscriptions_aud_revend__apm_rev_info]

END

IF object_id('[dbo].[subscription_users]') IS NULL
BEGIN
    CREATE TABLE [dbo].[subscription_users](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [version] [datetime2] NULL,
        [email_address] [nvarchar](255) NULL,
        [subscription_id] [int] NULL,
        PRIMARY KEY CLUSTERED
    (
    [id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]

    ALTER TABLE [dbo].[subscription_users]  WITH CHECK ADD  CONSTRAINT [FK_subscription_users_subscription_id__subscriptions] FOREIGN KEY([subscription_id])
        REFERENCES [dbo].[subscriptions] ([id])

    ALTER TABLE [dbo].[subscription_users] CHECK CONSTRAINT [FK_subscription_users_subscription_id__subscriptions]

END

IF object_id('[dbo].[subscription_users_aud]') IS NULL
BEGIN
    CREATE TABLE [dbo].[subscription_users_aud](
        [id] [int] NOT NULL,
        [rev] [int] NOT NULL,
        [revtype] [smallint] NULL,
        [revend] [int] NULL,
        [version] [datetime2] NULL,
        [email_address] [nvarchar](255) NULL,
        [subscription_id] [int] NULL,
        PRIMARY KEY CLUSTERED
    (
        [id] ASC,
    [rev] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]

    ALTER TABLE [dbo].[subscription_users_aud]  WITH CHECK ADD  CONSTRAINT [FK_subscription_users_aud_rev__apm_rev_info] FOREIGN KEY([rev])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[subscription_users_aud] CHECK CONSTRAINT [FK_subscription_users_aud_rev__apm_rev_info]

    ALTER TABLE [dbo].[subscription_users_aud]  WITH CHECK ADD  CONSTRAINT [FK_subscription_users_aud_revend__apm_rev_info] FOREIGN KEY([revend])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[subscription_users_aud] CHECK CONSTRAINT [FK_subscription_users_aud_revend__apm_rev_info]

END



IF object_id('[dbo].[system_message]') IS NULL
BEGIN
    CREATE TABLE [dbo].[system_message](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [version] [datetime2] NULL,
        [description] [nvarchar](255) NULL,
        [end_date] [datetime2](7) NULL,
        [reminder_date] [datetime2](7) NULL,
        PRIMARY KEY CLUSTERED
    (
    [id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]
END

IF object_id('[dbo].[system_message_aud]') IS NULL
BEGIN
    CREATE TABLE [dbo].[system_message_aud](
        [id] [int] NOT NULL,
        [rev] [int] NOT NULL,
        [revtype] [smallint] NULL,
        [revend] [int] NULL,
        [version] [datetime2] NULL,
        [description] [nvarchar](255) NULL,
        [end_date] [datetime2](7) NULL,
        [reminder_date] [datetime2](7) NULL,
        PRIMARY KEY CLUSTERED
    (
        [id] ASC,
    [rev] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]

    ALTER TABLE [dbo].[system_message_aud]  WITH CHECK ADD  CONSTRAINT [FK_system_message_aud_rev__apm_rev_info] FOREIGN KEY([rev])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[system_message_aud] CHECK CONSTRAINT [FK_system_message_aud_rev__apm_rev_info]

    ALTER TABLE [dbo].[system_message_aud]  WITH CHECK ADD  CONSTRAINT [FK_system_message_aud_revend__apm_rev_info] FOREIGN KEY([revend])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[system_message_aud] CHECK CONSTRAINT [FK_system_message_aud_revend__apm_rev_info]

END

IF object_id('[dbo].[users]') IS NULL
BEGIN
    CREATE TABLE [dbo].[users](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [version] [datetime2] NULL,
        [first_name] [nvarchar](255) NULL,
        [last_name] [nvarchar](255) NULL,
        [user_name] [nvarchar](255) NULL,
        [hashed_password] [nvarchar](255) NULL,
        PRIMARY KEY CLUSTERED
    (
    [id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]
END

IF object_id('[dbo].[users_aud]') IS NULL
BEGIN
    CREATE TABLE [dbo].[users_aud](
        [id] [int] NOT NULL,
        [rev] [int] NOT NULL,
        [revtype] [smallint] NULL,
        [revend] [int] NULL,
        [version] [datetime2] NULL,
        [first_name] [nvarchar](255) NULL,
        [last_name] [nvarchar](255) NULL,
        [user_name] [nvarchar](255) NULL,
        [hashed_password] [nvarchar](255) NULL,
        PRIMARY KEY CLUSTERED
    (
        [id] ASC,
    [rev] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY]

    ALTER TABLE [dbo].[users_aud]  WITH CHECK ADD  CONSTRAINT [FK_users_aud_rev__apm_rev_info] FOREIGN KEY([rev])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[users_aud] CHECK CONSTRAINT [FK_users_aud_rev__apm_rev_info]

    ALTER TABLE [dbo].[users_aud]  WITH CHECK ADD  CONSTRAINT [FK_users_aud_revend__apm_rev_info] FOREIGN KEY([revend])
        REFERENCES [dbo].[apm_rev_info] ([id])

    ALTER TABLE [dbo].[users_aud] CHECK CONSTRAINT [FK_users_aud_revend__apm_rev_info]

END

DECLARE @SQLString1 NVARCHAR(MAX);
SET @SQLString1 =  N'
    insert into Users(version, first_name, last_name, [user_name], hashed_password) values (''2022-10-07 07:20:12.4610000'', ''ken'', ''tan'', ''admin'', ''$shiro1$SHA-256$5$gciEWtTxlycvMk2tsAhr7Q==$UlFGQL7AgxHJxB3tGCdKwRteuDZvt4U92o1W0J1+hws='');
    insert into Users(version, first_name, last_name, [user_name], hashed_password) values (''2022-10-07 07:20:12.4610000'', ''ken'', ''tan'', ''serviceUser'', ''$shiro1$SHA-256$5$gciEWtTxlycvMk2tsAhr7Q==$UlFGQL7AgxHJxB3tGCdKwRteuDZvt4U92o1W0J1+hws='');
    insert into Users_aud(id, rev, revtype, revend, version, first_name, last_name, [user_name], hashed_password) values (1, 1, 0, null, ''2022-04-22 13:21:49.2630000'', ''ken'', ''tan'', ''admin'', ''$shiro1$SHA-256$5$gciEWtTxlycvMk2tsAhr7Q==$UlFGQL7AgxHJxB3tGCdKwRteuDZvt4U92o1W0J1+hws='');
    insert into Users_aud(id, rev, revtype, revend, version, first_name, last_name, [user_name], hashed_password) values (2, 1, 0, null, ''2022-04-22 13:21:49.2630000'', ''ken'', ''tan'', ''serviceUser'', ''$shiro1$SHA-256$5$gciEWtTxlycvMk2tsAhr7Q==$UlFGQL7AgxHJxB3tGCdKwRteuDZvt4U92o1W0J1+hws='');'
EXECUTE sp_executesql @SQLString1;