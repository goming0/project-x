/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ImgurRoot {
  data: Data;
  success: boolean;
  status: number;
}

export interface Data {
  id: string;
  title: string | null;
  description: string | null;
  datetime: number;
  type: string;
  animated: boolean;
  width: number;
  height: number;
  size: number;
  views: number;
  bandwidth: number;
  vote: any;
  favorite: boolean;
  nsfw: any;
  section: any;
  account_url: string | null;
  account_id: number;
  is_ad: boolean;
  in_most_viral: boolean;
  tags: any[];
  ad_type: number;
  ad_url: string;
  in_gallery: boolean;
  deletehash: string;
  name: string;
  link: string;
}
