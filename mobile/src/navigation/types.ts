export type RootStackParamList = {
  Tabs: undefined;
  ProductDetail: { id: string };
  SellerProfile: { id: string };
  Login: undefined;
  Register: undefined;
  AddEditProduct: { id?: string } | undefined;
  Search: { category?: string; query?: string } | undefined;
};

export type TabParamList = {
  Home: undefined;
  SearchTab: undefined;
  Dashboard: undefined;
  Profile: undefined;
};
