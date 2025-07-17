
import IndexComponent from './IndexConponenct';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title:"Aila-Web首頁",
  keywords:["劉星緯","Aila","個人作品","前端","前端工程師","React","NEXT","首頁","個人介紹"],
  description:"作為個人部落格，平常分享一些平常學習到的知識與放置作品集，使用Next並部屬在github與vercel上。本頁針對本人進行個人的簡單介紹。",
}


export default function Home() {
  return (
      <>
        <IndexComponent/>
      </>
  );
}
