export interface TokenRefreshData {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  scope: string;
  token_type: string;
}

export interface PatreonData {
  data: PatreonDatas[];
  included: PatreonIncluded[];
  links?: {
    next?: string;
  };
}

export interface PatreonIncluded {
  type: string;
  id: string;
  attributes: {
    social_connections?: {
      discord?: {
        user_id: string;
      };
    };
  };
}

export interface PatreonDatas {
  attributes: {
    last_charge_status: string;
    currently_entitled_amount_cents: number;
    full_name: string;
  };
  relationships: {
    currently_entitled_tiers: {
      data: Tiers[];
    };
    user: {
      data: {
        id: string;
      };
    };
  };
}

export interface Tiers {
  id: string;
}

export interface UserPatronData {
  _id: string;
  entitledTiers: string[];
  premiumFeatures: boolean;
  patreonBot: boolean;
  isDiscordUser: boolean;
  amount: number;
}
