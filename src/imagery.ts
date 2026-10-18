/* Real imagery from the nadir-main repository (demo/data/imagery): a historical 5 cm municipal
 * orthophoto of Manastirski Livadi East and 51.2 × 51.2 m crops from it. Labels follow the repo's
 * vocabulary: a crop is a candidate for review, never a confirmed dump. Box positions are each crop's
 * geographic footprint projected onto the overview (percent of its width and height). */
import overview from './assets/manastirski-livadi.jpg';
import r2c6_1 from './assets/crop-r2-c6-1.jpg';
import r2c5_1 from './assets/crop-r2-c5-1.jpg';
import r3c3_3 from './assets/crop-r3-c3-3.jpg';
import r3c1_4 from './assets/crop-r3-c1-4.jpg';
import r2c5_2 from './assets/crop-r2-c5-2.jpg';
import r1c3_2 from './assets/crop-r1-c3-2.jpg';
import r3c5_1 from './assets/crop-r3-c5-1.jpg';
import r2c1_1 from './assets/crop-r2-c1-1.jpg';

export const OVERVIEW = { src: overview, width: 2000, height: 1104 };

/** Visible material label from repo: the model's and the visual labeller's, not field-checked. */
export type Label = 'suspect' | 'uncertain' | 'none';

export type Crop = {
  id: string; src: string; label: Label;
  caption: [string, string];
  lat: number; lon: number;
  box: { x: number; y: number; w: number; h: number };
};

export const CANDIDATES: Crop[] = [
  { id: 'r2-c6-1', src: r2c6_1, label: 'suspect', caption: ['Светъл, натрошен материал, натрупан покрай път в края на гора', 'Pale, broken-up material piled along a track at the edge of woodland'], lat: 42.65486, lon: 23.29856, box: { x: 79.34, y: 51.16, w: 4.16, h: 7.32 } },
  { id: 'r2-c5-1', src: r2c5_1, label: 'uncertain', caption: ['Отломки, палети и смесени отпадъци на празен парцел до къщи', 'Rubble, pallets and mixed debris on a bare lot next to houses'], lat: 42.65481, lon: 23.29606, box: { x: 63.14, y: 51.9, w: 4.16, h: 7.32 } },
  { id: 'r3-c3-3', src: r3c3_3, label: 'uncertain', caption: ['Багер, купчини и отпадъци покрай изкоп на строеж', 'Excavator, stockpiles and debris along a ditch at a building site'], lat: 42.65564, lon: 23.29103, box: { x: 30.53, y: 39.12, w: 4.16, h: 7.32 } },
  { id: 'r3-c1-4', src: r3c1_4, label: 'uncertain', caption: ['Изхвърлен материал до строителна площадка в храсталак', 'Material dumped beside a construction area on scrubland'], lat: 42.65556, lon: 23.28729, box: { x: 6.23, y: 40.24, w: 4.16, h: 7.32 } },
  { id: 'r2-c5-2', src: r2c5_2, label: 'uncertain', caption: ['Разкопана земя с изхвърлен материал между паркирани коли', 'Disturbed ground with dumped material among parked cars'], lat: 42.65483, lon: 23.29731, box: { x: 71.24, y: 51.53, w: 4.16, h: 7.32 } },
  { id: 'r1-c3-2', src: r1c3_2, label: 'uncertain', caption: ['Двор с превозни средства, развалина и предмети в края на храсти', 'A yard of vehicles, a wreck and objects at the edge of scrub'], lat: 42.65289, lon: 23.29238, box: { x: 39.27, y: 81.56, w: 4.16, h: 7.32 } },
];

/** Crops with nothing to inspect: most of the area looks like this. */
export const DISMISSED: Crop[] = [
  { id: 'r3-c5-1', src: r3c5_1, label: 'none', caption: ['Открита поляна, няма какво да се проверява', 'Open grassland, nothing to inspect'], lat: 42.65665, lon: 23.296, box: { x: 62.72, y: 23.36, w: 4.16, h: 7.32 } },
  { id: 'r2-c1-1', src: r2c1_1, label: 'none', caption: ['Ливада с разпръснати храсти', 'Meadow with scattered shrubs'], lat: 42.65462, lon: 23.28607, box: { x: -1.65, y: 54.88, w: 4.16, h: 7.32 } },
];

export const LABEL_TEXT: Record<Label, [string, string]> = {
  suspect: ['Подозрително натрупване', 'Suspected accumulation'],
  uncertain: ['Несигурно', 'Uncertain'],
  none: ['Няма видим материал', 'No visible material'],
};

export const DEMO = { crops: 45, sites: 12, cropMetres: 51.2, pixelCm: 5 };

/** Five previously reported sites from the Sofia Inspectorate's map (as published by ACF, 28.05.2024).
 *  Current status unverified: a point is a reported location, not a confirmed dump. */
export const KNOWN_SITES: { place: string; district: [string, string] }[] = [
  { place: 'ул. „Президент Линкълн“, от бл. 2 до ул. „Бойчо Бойчев“', district: ['Овча купел', 'Ovcha Kupel'] },
  { place: 'Чепинско шосе, преди р. Искър', district: ['Нови Искър', 'Novi Iskar'] },
  { place: 'кв. Филиповци, края на ул. „Кап. Иван Златев“, до р. Шеовица', district: ['Люлин', 'Lyulin'] },
  { place: 'зад битпазара в Малашевци, ул. „Лавандула“', district: ['Подуяне', 'Poduyane'] },
  { place: 'южно от Младост', district: ['Младост', 'Mladost'] },
];

export const ATTRIBUTION: [string, string] = [
  'Ортофото: СМГ / ОП „Софияплан“, чрез UrbanData Sofia, CC BY 4.0. Изрязано и смалено; датата на заснемане не е известна.',
  'Orthophoto: СМГ / ОП “Софияплан”, via UrbanData Sofia, CC BY 4.0. Cropped and resampled; the acquisition date is unknown.',
];
