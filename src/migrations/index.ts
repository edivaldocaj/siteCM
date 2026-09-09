import * as migration_20260809_183032_sec_01_access_control from './20260809_183032_sec_01_access_control'
import * as migration_20260809_185100_sec_04_public_form_consent from './20260809_185100_sec_04_public_form_consent'
import * as migration_20260809_190400_team_refs from './20260809_190400_team_refs'
import * as migration_20260809_191500_cms_01_brand_config from './20260809_191500_cms_01_brand_config'
import * as migration_20260809_192000_cms_02_navigation from './20260809_192000_cms_02_navigation'
import * as migration_20260809_192500_cms_03_automation_and_logs from './20260809_192500_cms_03_automation_and_logs'
import * as migration_20260809_200500_auto_01_news_article_workflow from './20260809_200500_auto_01_news_article_workflow'
import * as migration_20260811_142611_native_payload_jobs from './20260811_142611_native_payload_jobs'
import * as migration_20260811_213000_fix_payload_jobs_task_enums from './20260811_213000_fix_payload_jobs_task_enums'
import * as migration_20260811_214500_payload_jobs_task_slug_varchar from './20260811_214500_payload_jobs_task_slug_varchar'
import * as migration_20260907_120000_lead_submission_outbox from './20260907_120000_lead_submission_outbox'
import * as migration_20260908_180000_campaign_category_values from './20260908_180000_campaign_category_values'

export const migrations = [
  {
    up: migration_20260809_183032_sec_01_access_control.up,
    down: migration_20260809_183032_sec_01_access_control.down,
    name: '20260809_183032_sec_01_access_control',
  },
  {
    up: migration_20260809_185100_sec_04_public_form_consent.up,
    down: migration_20260809_185100_sec_04_public_form_consent.down,
    name: '20260809_185100_sec_04_public_form_consent',
  },
  {
    up: migration_20260809_190400_team_refs.up,
    down: migration_20260809_190400_team_refs.down,
    name: '20260809_190400_team_refs',
  },
  {
    up: migration_20260809_191500_cms_01_brand_config.up,
    down: migration_20260809_191500_cms_01_brand_config.down,
    name: '20260809_191500_cms_01_brand_config',
  },
  {
    up: migration_20260809_192000_cms_02_navigation.up,
    down: migration_20260809_192000_cms_02_navigation.down,
    name: '20260809_192000_cms_02_navigation',
  },
  {
    up: migration_20260809_192500_cms_03_automation_and_logs.up,
    down: migration_20260809_192500_cms_03_automation_and_logs.down,
    name: '20260809_192500_cms_03_automation_and_logs',
  },
  {
    up: migration_20260809_200500_auto_01_news_article_workflow.up,
    down: migration_20260809_200500_auto_01_news_article_workflow.down,
    name: '20260809_200500_auto_01_news_article_workflow',
  },
  {
    up: migration_20260811_142611_native_payload_jobs.up,
    down: migration_20260811_142611_native_payload_jobs.down,
    name: '20260811_142611_native_payload_jobs',
  },
  {
    up: migration_20260811_213000_fix_payload_jobs_task_enums.up,
    down: migration_20260811_213000_fix_payload_jobs_task_enums.down,
    name: '20260811_213000_fix_payload_jobs_task_enums',
  },
  {
    up: migration_20260811_214500_payload_jobs_task_slug_varchar.up,
    down: migration_20260811_214500_payload_jobs_task_slug_varchar.down,
    name: '20260811_214500_payload_jobs_task_slug_varchar',
  },
  {
    up: migration_20260907_120000_lead_submission_outbox.up,
    down: migration_20260907_120000_lead_submission_outbox.down,
    name: '20260907_120000_lead_submission_outbox',
  },
  {
    up: migration_20260908_180000_campaign_category_values.up,
    down: migration_20260908_180000_campaign_category_values.down,
    name: '20260908_180000_campaign_category_values',
  },
]
