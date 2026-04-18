import { insertOnUpdate } from '@evershop/postgres-query-builder';

const cookieBannerSettingKeys = [
  'cookieBannerTitle',
  'cookieBannerMessage',
  'cookiePolicyUrl',
  'cookiePolicyLinkLabel'
];

export default async function migrate(connection: any) {
  await Promise.all(
    cookieBannerSettingKeys.map((name) =>
      insertOnUpdate('setting', ['name'])
        .given({
          name,
          value: '',
          is_json: 0
        })
        .execute(connection, false)
    )
  );
}