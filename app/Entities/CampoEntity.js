export class CampoEntity {
  constructor({
    id,
    name,
    cost = 0,
    globalEffects = [],
    duration = "until_replaced",
    weatherType = null,
    terrainType = null,
    artwork = null,
    soundtrack = null
  }) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.globalEffects = globalEffects;
    this.duration = duration;
    this.weatherType = weatherType;
    this.terrainType = terrainType;
    this.artwork = artwork;
    this.soundtrack = soundtrack;
  }
}
