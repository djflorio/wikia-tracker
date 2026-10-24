type RecordBase = {
  created_at: Date;
  id: number;
  updated_at: Date;
};


// SITE 

export type SiteRecord = RecordBase & {
  name: string;
  url: string;
};

export type SiteDetail = SiteRecord;

export type SiteList = Pick<SiteRecord, 'id' | 'name'>


// CATEGORY

export type CategoryRecord = RecordBase & {
  is_starred: boolean;
  site_id: number;
  text: string;
};

export type CategoryDetail = Omit<CategoryRecord, 'site_id'> & {
  site: SiteList;
};

export type CategoryList = Pick<CategoryRecord, 'id' | 'text'>;


// PAGE

export type PageRecord = RecordBase & {
  is_new: boolean;
  is_starred: boolean;
  site_id: number;
  title: string;
  url: string;
};

export type PageDetail = Omit<PageRecord, 'site_id'> & {
  site: SiteList;
};

export type PageCategoryRecord = RecordBase & {
  category_id: number;
  page_id: number;
};