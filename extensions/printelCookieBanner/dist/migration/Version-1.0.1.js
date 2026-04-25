import { insert, select, update } from '@evershop/postgres-query-builder';
const COOKIE_POLICY_URL_KEY = 'politica-cookie-uri';
const COOKIE_POLICY_NAME = 'Politica de cookie-uri';
const COOKIE_POLICY_CONTENT = `
  <p>
    Această pagină explică modul în care Printel folosește cookie-uri esențiale pentru funcționarea magazinului și servicii precum Google AdSense pentru măsurare și publicitate doar dacă îți exprimi acordul.
  </p>
  <p>
    Îți poți actualiza oricând opțiunile din bannerul de cookie-uri pentru a accepta, respinge sau personaliza cookie-urile neesențiale.
  </p>
`;
export default async function migrate(connection) {
    const existingPage = await select()
        .from('cms_page_description')
        .where('url_key', '=', COOKIE_POLICY_URL_KEY)
        .load(connection);
    if (existingPage) {
        await update('cms_page')
            .given({ status: 1 })
            .where('cms_page_id', '=', existingPage.cms_page_description_cms_page_id)
            .execute(connection);
        await update('cms_page_description')
            .given({
            name: COOKIE_POLICY_NAME,
            content: COOKIE_POLICY_CONTENT,
            meta_title: COOKIE_POLICY_NAME,
            meta_description: 'Detalii despre cookie-urile folosite de Printel și despre gestionarea consimțământului.'
        })
            .where('cms_page_description_cms_page_id', '=', existingPage.cms_page_description_cms_page_id)
            .execute(connection);
        return;
    }
    const page = await insert('cms_page')
        .given({ status: 1 })
        .execute(connection);
    await insert('cms_page_description')
        .given({
        url_key: COOKIE_POLICY_URL_KEY,
        name: COOKIE_POLICY_NAME,
        content: COOKIE_POLICY_CONTENT,
        meta_title: COOKIE_POLICY_NAME,
        meta_description: 'Detalii despre cookie-urile folosite de Printel și despre gestionarea consimțământului.'
    })
        .prime('cms_page_description_cms_page_id', page.insertId)
        .execute(connection);
}
//# sourceMappingURL=Version-1.0.1.js.map