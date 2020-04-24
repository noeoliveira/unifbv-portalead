import { database, storage } from "../config";
import firebase from "firebase/app";
import collections from "../../../utils/collections";
const FieldValue = firebase.firestore.FieldValue;

function upload(file, onProgress, onError, onComplete) {
  return new Promise((resolve, reject) => {
    const task = storage.ref(`/videos/${Date.now()}_${file.name}`).put(file);

    task.on(
      "state_changed",
      onProgress,
      (error) => {
        onError(error);
        reject(error);
      },
      async () => {
        if (onComplete) {
          onComplete();
        }

        resolve(await task.snapshot.ref.getDownloadURL());
      }
    );
  });
}

class Video {
  //precisa ser testado
  async create(data, onProgress, onError, onComplete) {
    data.file = await upload(data.file, onProgress, onError, onComplete);
    const ref = database.collection(collections.videos).doc();
    await ref.set(data);
    database
      .collection(collections.courses)
      .doc(data.idCourse)
      .update({
        videos: FieldValue.arrayUnion(ref),
      });
  }

  list(idCourse, observer) {
    const resolver = async (query) => {
      const data = query.data();
      console.log(data.videos[0]);

      return await Promise.all(
        data.videos.map((item) =>
          item.get().then((resp) => ({ id: resp.id, ...resp.data() }))
        )
      );
    };

    if (observer) {
      database
        .collection(collections.courses)
        .doc(idCourse)
        .onSnapshot(async (query) => observer(await resolver(query)));
    } else {
      return database
        .collection(collections.courses)
        .doc(idCourse)
        .get()
        .then(resolver);
    }
  }

  async listUnique(id, observer) {
    const resolver = async (query) => {
      console.log(await storage.refFromURL(query.data().file).getMetadata());
      return query.data();
    };

    if (observer) {
      database
        .collection(collections.videos)
        .doc(id)
        .onSnapshot((query) => observer(resolver(query)));
    } else {
      return database
        .collection(collections.videos)
        .doc(id)
        .get()
        .then(resolver);
    }
  }

  async update(id, data, onProgress, onError, onComplete) {
    if (typeof data.file === "object") {
      data.file = await upload(data.file, onProgress, onError, onComplete);
    }
    return database.collection(collections.videos).doc(id).update(data);
  }

  async delete(data) {
    const ref = database.collection(collections.videos).doc(data.id);

    database
      .collection(collections.courses)
      .doc(data.idCourse)
      .update({
        videos: FieldValue.arrayRemove(ref),
      });
    await storage.refFromURL(data.file).delete();
    ref.delete();
  }
}

export default new Video();