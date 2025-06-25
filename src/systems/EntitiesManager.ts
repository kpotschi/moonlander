import GameScene from "../scenes/GameScene";

export default class EntitiesManager {
  constructor(readonly scene: GameScene) {}

  public createFromTilemap() {
    this.scene.mapData = this.scene.make.tilemap({ key: "level-1" });

    this.scene.mapData.objects.forEach((objectLayer) => {
      objectLayer.objects.forEach((object) => {
        if (object.gid) {
          const textureName: string = this.getByGid(object.gid);
          const entity = this.scene.add.image(
            object.x || 0,
            object.y || 0,
            "textures",
            textureName
          );
          this.scene.ui.camera.ignore(entity);
          entity.setAngle(object.rotation || 0);
          entity.setName(object.name || `entity-${object.gid}`);
          console.log(object.width, object.height);

          entity.setDisplaySize(object.width || 32, object.height || 32);
        }
      });
    });
  }

  getByGid(gid: number) {
    const collection = this.scene.mapData.imageCollections.find((collection) =>
      collection.containsImageIndex(gid)
    );

    const imageObject = collection?.images.find((image) => image.gid === gid);

    if (!imageObject) {
      console.warn(`No image found for gid ${gid}`);
      return null;
    }

    return imageObject.image.split("/").pop();
  }
}
