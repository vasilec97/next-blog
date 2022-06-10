import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  collection,
  getFirestore,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  startAfter,
  limit,
  collectionGroup,
  Timestamp
} from "firebase/firestore";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCJNbqfQoIObTJvu_gTm7YLAmsSJAriqNE",
  authDomain: "something-unique-91fec.firebaseapp.com",
  projectId: "something-unique-91fec",
  storageBucket: "something-unique-91fec.appspot.com",
  messagingSenderId: "1022310039056",
  appId: "1:1022310039056:web:eb1bce5b51afe552655495",
  measurementId: "G-V1E0ZQLZ51"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Helper functions
export async function getUserWithUsername(username) {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));

  return (await getDocs(q)).docs[0];
}

export async function getPostsForUser(doc, options) {
  const { _where, _orderBy, _limit } = options;

  const postsQuery = query(
    collection(doc.ref, "posts"),
    where(..._where),
    orderBy(..._orderBy),
    limit(_limit)
  );

  return (await getDocs(postsQuery)).docs.map(postToJSON);
}

export async function getAllPosts(
  options = {
    _where: ["pubkished", "==", true],
    _orderBy: ["createdAt", "desc"],
    _limit: 5
  }
) {
  const { _where, _orderBy, _limit } = options;

  const q = query(
    collectionGroup(firestore, "posts"),
    where(..._where),
    orderBy(..._orderBy),
    limit(_limit)
  );

  return (await getDocs(q)).docs.map(postToJSON);
}

export async function getNextPosts(posts, options) {
  const { _where, _orderBy, _limit } = options;

  const last = posts[posts.length - 1];
  const cursor =
    typeof last.createdAt === "number"
      ? Timestamp.fromMillis(last.createdAt)
      : last.createdAt;

  const q = query(
    collectionGroup(firestore, "posts"),
    where(..._where),
    orderBy(..._orderBy),
    startAfter(cursor),
    limit(_limit)
  );

  let newPosts = [];
  newPosts = (await getDocs(q)).docs.map((doc) => doc.data());

  return newPosts;
}

export async function getPostWithPath(userDoc, slug) {
  let post, path;

  console.log("Slug: ", slug);

  if (userDoc) {
    const postRef = doc(userDoc.ref, "posts", slug);
    post = postToJSON(await getDoc(postRef));
    path = postRef.path;
  }

  return { post, path };
}

export async function getPaths() {
  return (await getDocs(collectionGroup(firestore, "posts"))).docs.map(
    (doc) => {
      const { username, slug } = doc.data();
      return { params: { username, slug } };
    }
  );
}

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis()
  };
}
