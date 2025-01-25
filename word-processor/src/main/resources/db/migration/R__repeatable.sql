IF object_id('[dbo].[email_templates]') IS NULL
    BEGIN
        CREATE TABLE [dbo].[email_templates](
            [id] [bigint] NOT NULL,
            [last_saved] [datetime2](7) NULL,
            [custom_footer] [varchar](max) NULL,
            [template] [varchar](max) NULL,
            [type] [int] NOT NULL,
            PRIMARY KEY CLUSTERED
                ([id] ASC)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
                    CONSTRAINT [UK_email_templates] UNIQUE NONCLUSTERED
                ([type] ASC)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
    END

IF object_id('[dbo].[email_templates_aud]') IS NULL
    BEGIN
        CREATE TABLE [dbo].[email_templates_aud](
            [id] [bigint] NOT NULL,
            [rev] [int] NOT NULL,
            [revtype] [smallint] NULL,
            [revend] [int] NULL,
            [last_saved] [datetime2](7) NULL,
            [custom_footer] [varchar](max) NULL,
            [template] [varchar](max) NULL,
            [type] [int] NULL,
            PRIMARY KEY CLUSTERED([id] ASC, [REV] ASC)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

        ALTER TABLE [dbo].[email_templates_AUD]  WITH CHECK ADD  CONSTRAINT [FK_email_templates_aud_rev__apm_rev_info] FOREIGN KEY([REV])  REFERENCES [dbo].[apm_rev_info] ([id])
        ALTER TABLE [dbo].[email_templates_AUD] CHECK CONSTRAINT [FK_email_templates_aud_rev__apm_rev_info]

        ALTER TABLE [dbo].[email_templates_AUD]  WITH CHECK ADD  CONSTRAINT [FK_email_templates_aud_revend__apm_rev_info] FOREIGN KEY([REVEND]) REFERENCES [dbo].[apm_rev_info] ([id])
        ALTER TABLE [dbo].[email_templates_AUD] CHECK CONSTRAINT [FK_email_templates_aud_revend__apm_rev_info]

    END

IF NOT EXISTS (SELECT * FROM Information_Schema.Columns WHERE Table_Name = 'account' AND Column_Name = 'provisioning_status')
    BEGIN
        ALTER TABLE account ADD provisioning_status NVARCHAR(MAX) NULL;
    END

IF NOT EXISTS (SELECT * FROM Information_Schema.Columns WHERE Table_Name = 'account_aud' AND Column_Name = 'provisioning_status')
    BEGIN
        ALTER TABLE account_aud ADD provisioning_status NVARCHAR(MAX) NULL;
    END

IF object_id('[dbo].[email_log]') IS NULL
    BEGIN
        CREATE TABLE [dbo].[email_log](
              [id] [int] IDENTITY(1,1) NOT NULL,
              [version] [datetime2](7) NOT NULL,
              [date] [datetime] NOT NULL,
              [status] [bit] NOT NULL,
              [sender] [nvarchar](255) NOT NULL,
              [receiver] [nvarchar](255) NOT NULL,
              [log_message] [nvarchar](max) NULL,
              [message] [nvarchar](max) NOT NULL,
              [subject] [nvarchar](max) NULL
        ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
    END
IF NOT EXISTS (SELECT * FROM Information_Schema.Columns WHERE Table_Name = 'account' AND Column_Name = 'expiry_date' and DATA_TYPE = 'date')
    BEGIN
        ALTER TABLE account ALTER COLUMN [expiry_date] date null
    END
IF NOT EXISTS (SELECT * FROM Information_Schema.Columns WHERE Table_Name = 'account_aud' AND Column_Name = 'expiry_date'  and DATA_TYPE = 'date')
    BEGIN
        ALTER TABLE account_aud ALTER COLUMN [expiry_date] date null
    END
IF NOT EXISTS (SELECT * FROM Information_Schema.Columns WHERE Table_Name = 'account' AND Column_Name = 'provisioning_status_message')
    BEGIN
        ALTER TABLE account ADD provisioning_status_message NVARCHAR(MAX) NULL;
    END
IF NOT EXISTS (SELECT * FROM Information_Schema.Columns WHERE Table_Name = 'account_aud' AND Column_Name = 'provisioning_status_message')
    BEGIN
        ALTER TABLE account_aud ADD provisioning_status_message NVARCHAR(MAX) NULL;
    END