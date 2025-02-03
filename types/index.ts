export type Login = {
  username: string;
  password: string;
};

export type Logout = {
  token: string;
};

export type CreateRuasParams = {
  unit_id: number;
  ruas_name: string;
  long: string;
  km_awal: string;
  km_akhir: string;
  status: string;
  coordinates: string[];
};

export type UpdateRuasParams = {
  unit_id: number;
  ruas_name: string;
  long: string;
  km_awal: string;
  km_akhir: string;
  status: string;
  coordinates: string[];
};

export type GetAllUnitKerja = {
  id: number;
  unit: string;
};
