
IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'user_email_invite')
    DROP TABLE user_email_invite

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'user_email_verification')
    DROP TABLE user_email_verification

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'user_forgot_password')
    DROP TABLE user_forgot_password

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'sms_log')
    DROP TABLE sms_log

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'email_log')
    DROP TABLE email_log

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'authorized_token')
    DROP TABLE authorized_token

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'candidate_response_score')
    DROP TABLE candidate_response_score

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'candidate_response')
    DROP TABLE candidate_response

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'candidate_attempt_log')
    DROP TABLE candidate_attempt_log

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'candidate_assessment')
    DROP TABLE candidate_assessment

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'answer_option')
    DROP TABLE answer_option

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'question_comment')
    DROP TABLE question_comment

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'question')
    DROP TABLE question

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'assessment_block')
    DROP TABLE assessment_block

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'assessment')
    DROP TABLE assessment

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'organization_users')
    DROP TABLE organization_users

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'users')
    DROP TABLE users

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'organization')
    DROP TABLE organization

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'candidate')
    DROP TABLE candidate

IF EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'files')
    DROP TABLE files

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'answer_option')
BEGIN
CREATE TABLE [dbo].[answer_option](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [correct] [bit] NOT NULL,
    [score] [int] NULL,
    [text] [nvarchar](1000) NULL,
    [question_id] [int] NOT NULL,
    CONSTRAINT [PK__answer_o__3213E83FC41112C6] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'assessment')
BEGIN
CREATE TABLE [dbo].[assessment](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [activated_on] [date] NULL,
    [deactivated_on] [date] NULL,
    [department] [nvarchar](255) NULL,
    [introduction] [nvarchar](max) NULL,
    [name] [nvarchar](255) NULL,
    [position] [nvarchar](255) NULL,
    [status] [nvarchar](255) NULL,
    [token] [nvarchar](255) NULL,
    [video_link_url] [nvarchar](255) NULL,
    [header_image_id] [int] NULL,
    [organization_id] [int] NULL,
    CONSTRAINT [PK__assessme__3213E83F75CDE880] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'assessment_block')
BEGIN
CREATE TABLE [dbo].[assessment_block](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [closing_comments] [nvarchar](max) NULL,
    [duration] [int] NULL,
    [instruction] [nvarchar](max) NULL,
    [sort_order] [int] NULL,
    [title] [nvarchar](255) NULL,
    [assessment_id] [int] NULL,
    CONSTRAINT [PK__assessme__3213E83FB2FE862D] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'authorized_token')
BEGIN
CREATE TABLE [dbo].[authorized_token](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [access_token_hash] [nvarchar](255) NULL,
    [refresh_token_hash] [nvarchar](255) NULL,
    [candidate_id] [int] NULL,
    [user_id] [int] NULL,
    CONSTRAINT [PK__authoriz__3213E83F6AA58948] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'candidate')
BEGIN
CREATE TABLE [dbo].[candidate](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [contact_number] [nvarchar](255) NULL,
    [email] [nvarchar](255) NULL,
    [name] [nvarchar](255) NULL,
    [verification_code] [int] NULL,
    [verified] [bit] NOT NULL,
    [photo_id] [int] NULL,
    CONSTRAINT [PK__candidat__3213E83F29382B49] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'candidate_assessment')
BEGIN
CREATE TABLE [dbo].[candidate_assessment](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [assessment_decision] [nvarchar](255) NULL,
    [end_date] [datetime2](6) NULL,
    [start_date] [datetime2](6) NULL,
    [status] [nvarchar](255) NULL,
    [assessment_id] [int] NOT NULL,
    [active_assessment_block_id] [int] NOT NULL,
    [candidate_id] [int] NOT NULL,
    CONSTRAINT [PK__candidat__3213E83F10B62E05] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'candidate_attempt_log')
BEGIN
CREATE TABLE [dbo].[candidate_attempt_log](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [attempted_on] [datetime2](6) NULL,
    [assessment_id] [int] NULL,
    [candidate_id] [int] NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'candidate_response')
BEGIN
CREATE TABLE [dbo].[candidate_response](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [answer_text] [nvarchar](max) NULL,
    [answers] [nvarchar](255) NULL,
    [candidate_assessment_id] [int] NOT NULL,
    [file_id] [int] NULL,
    [question_id] [int] NOT NULL,
    CONSTRAINT [PK__candidat__3213E83F92771515] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'candidate_response_score')
BEGIN
CREATE TABLE [dbo].[candidate_response_score](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [score] [int] NULL,
    [assessment_id] [int] NOT NULL,
    [assessment_block_id] [int] NOT NULL,
    [candidate_id] [int] NOT NULL,
    [question_id] [int] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'email_log')
BEGIN
CREATE TABLE [dbo].[email_log](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [error_log] [text] NULL,
    [message] [text] NULL,
    [receiver] [nvarchar](255) NULL,
    [sender] [nvarchar](255) NULL,
    [status] [bit] NOT NULL,
    CONSTRAINT [PK__email_lo__3213E83F0EF680DA] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'files')
BEGIN
CREATE TABLE [dbo].[files](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [disk] [nvarchar](255) NULL,
    [mime_type] [nvarchar](255) NULL,
    [name] [nvarchar](255) NULL,
    [original_name] [nvarchar](255) NULL,
    [size] [int] NULL,
    [url] [nvarchar](1000) NULL,
    [version] [datetime2](7) NULL,
    CONSTRAINT [PK__file__3213E83F2598FF15] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'organization')
BEGIN
CREATE TABLE [dbo].[organization](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [about] [nvarchar](max) NULL,
    [contact_number] [nvarchar](255) NULL,
    [email] [nvarchar](255) NULL,
    [name] [nvarchar](255) NULL,
    [url] [nvarchar](4000) NULL,
    [logo_id] [int] NULL,
    [version] [datetime2](7) NULL,
    CONSTRAINT [PK__organiza__3213E83FB8B7923D] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'organization_users')
BEGIN
CREATE TABLE [dbo].[organization_users](
    [organization_id] [int] NOT NULL,
    [users_id] [int] NOT NULL,
     CONSTRAINT [UK_ag03e4qasggh4qxd93rfod6wk] UNIQUE NONCLUSTERED
    (
[users_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'question')
BEGIN
CREATE TABLE [dbo].[question](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [options] [varchar](255) NULL,
    [score] [int] NULL,
    [sort_order] [int] NULL,
    [text] [nvarchar](max) NULL,
    [type] [varchar](255) NULL,
    [assessment_block_id] [int] NOT NULL,
    CONSTRAINT [PK__question__3213E83FCFC97386] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'question_comment')
BEGIN
CREATE TABLE [dbo].[question_comment](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [comment] [varchar](100) NULL,
    [username] [nvarchar](100) NULL,
    [candidate_id] [int] NOT NULL,
    [question_id] [int] NOT NULL,
    CONSTRAINT [PK__question__3213E83FD63A7A90] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'sms_log')
BEGIN
CREATE TABLE [dbo].[sms_log](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [receiver] [nvarchar](255) NULL,
    [response] [text] NULL,
    [sender] [nvarchar](255) NULL,
    [status] [nvarchar](255) NULL,
    [uid] [nvarchar](255) NULL,
    CONSTRAINT [PK__sms_log__3213E83FE8ED3FE4] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'user_email_invite')
BEGIN
CREATE TABLE [dbo].[user_email_invite](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [email] [nvarchar](255) NULL,
    [token] [nvarchar](255) NULL,
    [organization_id] [int] NULL,
    CONSTRAINT [PK__user_ema__3213E83F6C388989] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'user_email_verification')
BEGIN
CREATE TABLE [dbo].[user_email_verification](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [token] [nvarchar](255) NULL,
    [user_id] [int] NULL,
    CONSTRAINT [PK__user_ema__3213E83F2511E0D8] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'user_forgot_password')
BEGIN
CREATE TABLE [dbo].[user_forgot_password](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [token] [nvarchar](255) NULL,
    [user_id] [int] NULL,
    CONSTRAINT [PK__user_for__3213E83FA840F55C] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

IF NOT EXISTS (SELECT *  FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_NAME = 'users')
BEGIN
CREATE TABLE [dbo].[users](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [version] [datetime2](6) NULL,
    [active] [bit] NOT NULL,
    [department] [nvarchar](255) NULL,
    [designation] [nvarchar](255) NULL,
    [email] [nvarchar](255) NULL,
    [name] [nvarchar](255) NULL,
    [password] [nvarchar](255) NULL,
    [role] [nvarchar](255) NULL,
    [organization_id] [int] NULL,
    [photo_id] [int] NULL,
    CONSTRAINT [PK__users__3213E83FC2736984] PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
    CONSTRAINT [UK_6dotkott2kjsp8vw4d0m25fb7] UNIQUE NONCLUSTERED
(
[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

ALTER TABLE [dbo].[answer_option]  WITH CHECK ADD  CONSTRAINT [FK_answer_option__question__question_id] FOREIGN KEY([question_id]) REFERENCES [dbo].[question] ([id]) ON DELETE CASCADE
GO
ALTER TABLE [dbo].[answer_option] CHECK CONSTRAINT [FK_answer_option__question__question_id]
    GO
ALTER TABLE [dbo].[assessment]  WITH CHECK ADD  CONSTRAINT [FK_assessment__organization__organization_id] FOREIGN KEY([organization_id]) REFERENCES [dbo].[organization] ([id])
    GO
ALTER TABLE [dbo].[assessment] CHECK CONSTRAINT [FK_assessment__organization__organization_id]
    GO
ALTER TABLE [dbo].[assessment]  WITH CHECK ADD  CONSTRAINT [FK_assessment__files__header_image_id] FOREIGN KEY([header_image_id]) REFERENCES [dbo].[files] ([id])
    GO
ALTER TABLE [dbo].[assessment] CHECK CONSTRAINT [FK_assessment__files__header_image_id]
    GO
ALTER TABLE [dbo].[assessment_block]  WITH CHECK ADD  CONSTRAINT [FK_assessment_block__assessment__assessment_id] FOREIGN KEY([assessment_id]) REFERENCES [dbo].[assessment] ([id]) ON DELETE CASCADE
GO
ALTER TABLE [dbo].[assessment_block] CHECK CONSTRAINT [FK_assessment_block__assessment__assessment_id]
    GO
ALTER TABLE [dbo].[authorized_token]  WITH CHECK ADD  CONSTRAINT [FK_authorized_token__users__user_id] FOREIGN KEY([user_id]) REFERENCES [dbo].[users] ([id])
    GO
ALTER TABLE [dbo].[authorized_token] CHECK CONSTRAINT [FK_authorized_token__users__user_id]
    GO
ALTER TABLE [dbo].[authorized_token]  WITH CHECK ADD  CONSTRAINT [FK_authorized_token__candidate__candidate_id] FOREIGN KEY([candidate_id]) REFERENCES [dbo].[candidate] ([id])
    GO
ALTER TABLE [dbo].[authorized_token] CHECK CONSTRAINT [FK_authorized_token__candidate__candidate_id]
    GO
ALTER TABLE [dbo].[candidate]  WITH CHECK ADD  CONSTRAINT [FK_candidate__files__photo_id] FOREIGN KEY([photo_id]) REFERENCES [dbo].[files] ([id])
    GO
ALTER TABLE [dbo].[candidate] CHECK CONSTRAINT [FK_candidate__files__photo_id]
    GO
ALTER TABLE [dbo].[candidate_assessment]  WITH CHECK ADD  CONSTRAINT [FK_candidate_assessment__assessment_block__active_assessment_block_id] FOREIGN KEY([active_assessment_block_id]) REFERENCES [dbo].[assessment_block] ([id])
    GO
ALTER TABLE [dbo].[candidate_assessment] CHECK CONSTRAINT [FK_candidate_assessment__assessment_block__active_assessment_block_id]
    GO
ALTER TABLE [dbo].[candidate_assessment]  WITH CHECK ADD  CONSTRAINT [FK_candidate_assessment__assessment__assessment_id] FOREIGN KEY([assessment_id]) REFERENCES [dbo].[assessment] ([id])
    GO
ALTER TABLE [dbo].[candidate_assessment] CHECK CONSTRAINT [FK_candidate_assessment__assessment__assessment_id]
    GO
ALTER TABLE [dbo].[candidate_assessment]  WITH CHECK ADD  CONSTRAINT [FK_candidate_assessment__candidate__candidate_id] FOREIGN KEY([candidate_id]) REFERENCES [dbo].[candidate] ([id])
    GO
ALTER TABLE [dbo].[candidate_assessment] CHECK CONSTRAINT [FK_candidate_assessment__candidate__candidate_id]
    GO
ALTER TABLE [dbo].[candidate_attempt_log]  WITH CHECK ADD  CONSTRAINT [FK_candidate_attempt_log__candidate__candidate_id] FOREIGN KEY([candidate_id]) REFERENCES [dbo].[candidate] ([id])
    GO
ALTER TABLE [dbo].[candidate_attempt_log] CHECK CONSTRAINT [FK_candidate_attempt_log__candidate__candidate_id]
    GO
ALTER TABLE [dbo].[candidate_attempt_log]  WITH CHECK ADD  CONSTRAINT [FK_candidate_attempt_log__assessment__assessment_id] FOREIGN KEY([assessment_id]) REFERENCES [dbo].[assessment] ([id])
    GO
ALTER TABLE [dbo].[candidate_attempt_log] CHECK CONSTRAINT [FK_candidate_attempt_log__assessment__assessment_id]
    GO
ALTER TABLE [dbo].[candidate_response]  WITH CHECK ADD  CONSTRAINT [FK_candidate_response__question__question_id] FOREIGN KEY([question_id]) REFERENCES [dbo].[question] ([id])
    GO
ALTER TABLE [dbo].[candidate_response] CHECK CONSTRAINT [FK_candidate_response__question__question_id]
    GO
ALTER TABLE [dbo].[candidate_response]  WITH CHECK ADD  CONSTRAINT [FK_candidate_response__files__file_id] FOREIGN KEY([file_id]) REFERENCES [dbo].[files] ([id])
    GO
ALTER TABLE [dbo].[candidate_response] CHECK CONSTRAINT [FK_candidate_response__files__file_id]
    GO
ALTER TABLE [dbo].[candidate_response]  WITH CHECK ADD  CONSTRAINT [FK_candidate_response__candidate_assessment__candidate_assessment_id] FOREIGN KEY([candidate_assessment_id]) REFERENCES [dbo].[candidate_assessment] ([id])
    GO
ALTER TABLE [dbo].[candidate_response] CHECK CONSTRAINT [FK_candidate_response__candidate_assessment__candidate_assessment_id]
    GO
ALTER TABLE [dbo].[candidate_response_score]  WITH CHECK ADD  CONSTRAINT [FK_candidate_response_score__assessment_block__assessment_block_id] FOREIGN KEY([assessment_block_id]) REFERENCES [dbo].[assessment_block] ([id])
    GO
ALTER TABLE [dbo].[candidate_response_score] CHECK CONSTRAINT [FK_candidate_response_score__assessment_block__assessment_block_id]
    GO
ALTER TABLE [dbo].[candidate_response_score]  WITH CHECK ADD  CONSTRAINT [FK_candidate_response_score__assessment__assessment_id] FOREIGN KEY([assessment_id]) REFERENCES [dbo].[assessment] ([id])
    GO
ALTER TABLE [dbo].[candidate_response_score] CHECK CONSTRAINT [FK_candidate_response_score__assessment__assessment_id]
    GO
ALTER TABLE [dbo].[candidate_response_score]  WITH CHECK ADD  CONSTRAINT [FK_candidate_response_score__candidate__candidate_id] FOREIGN KEY([candidate_id]) REFERENCES [dbo].[candidate] ([id])
    GO
ALTER TABLE [dbo].[candidate_response_score] CHECK CONSTRAINT [FK_candidate_response_score__candidate__candidate_id]
    GO
ALTER TABLE [dbo].[candidate_response_score]  WITH CHECK ADD  CONSTRAINT [FK_candidate_response_score__question__question_id] FOREIGN KEY([question_id]) REFERENCES [dbo].[question] ([id])
    GO
ALTER TABLE [dbo].[candidate_response_score] CHECK CONSTRAINT [FK_candidate_response_score__question__question_id]
    GO
ALTER TABLE [dbo].[organization]  WITH CHECK ADD  CONSTRAINT [FK_organization__files__logo_id] FOREIGN KEY([logo_id]) REFERENCES [dbo].[files] ([id])
    GO
ALTER TABLE [dbo].[organization] CHECK CONSTRAINT [FK_organization__files__logo_id]
    GO
ALTER TABLE [dbo].[organization_users]  WITH CHECK ADD  CONSTRAINT [FK_organization_users__users__users_id] FOREIGN KEY([users_id]) REFERENCES [dbo].[users] ([id])
    GO
ALTER TABLE [dbo].[organization_users] CHECK CONSTRAINT [FK_organization_users__users__users_id]
    GO
ALTER TABLE [dbo].[organization_users]  WITH CHECK ADD  CONSTRAINT [FK_organization_users__organization__organization_id] FOREIGN KEY([organization_id]) REFERENCES [dbo].[organization] ([id])
    GO
ALTER TABLE [dbo].[organization_users] CHECK CONSTRAINT [FK_organization_users__organization__organization_id]
    GO
ALTER TABLE [dbo].[question]  WITH CHECK ADD  CONSTRAINT [FK_question__assessment_block__assessment_block_id] FOREIGN KEY([assessment_block_id]) REFERENCES [dbo].[assessment_block] ([id]) ON DELETE CASCADE
GO
ALTER TABLE [dbo].[question] CHECK CONSTRAINT [FK_question__assessment_block__assessment_block_id]
    GO
ALTER TABLE [dbo].[question_comment]  WITH CHECK ADD  CONSTRAINT [FK_question_comment__candidate__candidate_id] FOREIGN KEY([candidate_id]) REFERENCES [dbo].[candidate] ([id])
    GO
ALTER TABLE [dbo].[question_comment] CHECK CONSTRAINT [FK_question_comment__candidate__candidate_id]
    GO
ALTER TABLE [dbo].[question_comment]  WITH CHECK ADD  CONSTRAINT [FK_question_comment__question__question_id] FOREIGN KEY([question_id]) REFERENCES [dbo].[question] ([id])
    GO
ALTER TABLE [dbo].[question_comment] CHECK CONSTRAINT [FK_question_comment__question__question_id]
    GO
ALTER TABLE [dbo].[user_email_invite]  WITH CHECK ADD  CONSTRAINT [FK_user_email_invite__organization__organization_id] FOREIGN KEY([organization_id]) REFERENCES [dbo].[organization] ([id])
    GO
ALTER TABLE [dbo].[user_email_invite] CHECK CONSTRAINT [FK_user_email_invite__organization__organization_id]
    GO
ALTER TABLE [dbo].[user_email_verification]  WITH CHECK ADD  CONSTRAINT [FK_user_email_verification__users__user_id] FOREIGN KEY([user_id]) REFERENCES [dbo].[users] ([id])
    GO
ALTER TABLE [dbo].[user_email_verification] CHECK CONSTRAINT [FK_user_email_verification__users__user_id]
    GO
ALTER TABLE [dbo].[user_forgot_password]  WITH CHECK ADD  CONSTRAINT [FK_user_forgot_password__users__user_id] FOREIGN KEY([user_id]) REFERENCES [dbo].[users] ([id])
    GO
ALTER TABLE [dbo].[user_forgot_password] CHECK CONSTRAINT [FK_user_forgot_password__users__user_id]
    GO
ALTER TABLE [dbo].[users]  WITH CHECK ADD  CONSTRAINT [FK_users__files__photo_id] FOREIGN KEY([photo_id]) REFERENCES [dbo].[files] ([id])
    GO
ALTER TABLE [dbo].[users] CHECK CONSTRAINT [FK_users__files__photo_id]
    GO
ALTER TABLE [dbo].[users]  WITH CHECK ADD  CONSTRAINT [FK_users__organization__organization_id] FOREIGN KEY([organization_id]) REFERENCES [dbo].[organization] ([id])
    GO
ALTER TABLE [dbo].[users] CHECK CONSTRAINT [FK_users__organization__organization_id]

