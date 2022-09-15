/* eslint-disable @typescript-eslint/no-empty-interface */
import { BaseResource } from '.';

export interface Weapon extends BaseResource {
  rarity: number;
  subStat?: string;
  specialAbility?: string;
  weaponType: string;
}
