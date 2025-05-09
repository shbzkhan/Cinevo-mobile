
// import {
//   Account,
//   Avatars,
//   Client,
//   Databases,
//   ID,
//   Query,
//   Storage,
// } from "react-native-appwrite";

// export const config = {
//   endpoint: process.env.EXPO_PUBLIC_ENDPOINT,
//   platform: process.env.EXPO_PUBLIC_PLATEFORM,
//   projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
//   databaseId: process.env.EXPO_PUBLIC_DATABASE_ID,
//   userCollectionId: process.env.EXPO_PUBLIC_USER_COLLECTION_ID,
//   videoCollectionId: process.env.EXPO_PUBLIC_VIDEO_COLLECTION_ID,
//   storageId: process.env.EXPO_PUBLIC_STORAGE_ID,
// };

// // Init your React Native SDK
// const client = new Client();

// client
//   .setEndpoint(config.endpoint)
//   .setProject(config.projectId)
//   .setPlatform(config.platform);

// const account = new Account(client);
// const avatars = new Avatars(client);
// const databases = new Databases(client);
// const storage = new Storage(client);

// export const createUser = async (email, password, username) => {
//   try {
//     const newAccount = await account.create(
//       ID.unique(),
//       email,
//       password,
//       username
//     );

//     if (!newAccount) throw Error;

//     const avatarUrl = avatars.getInitials(username);

//     await signIn(email, password);

//     const newUser = await databases.createDocument(
//       config.databaseId,
//       config.userCollectionId,
//       ID.unique(),
//       {
//         accoundId: newAccount.$id,
//         email,
//         username,
//         avatar: avatarUrl,
//       }
//     );

//     return newUser;
//   } catch (error) {
//     console.log(error);
//     throw new Error(error);
//   }
// };

// export const signIn = async (email, password) => {
//   try {
//     const session = await account.createEmailPasswordSession(email, password);
//     return session;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// export const getCurrentUser = async () => {
//   try {
//     const currentAccount = await account.get();
//     if (!currentAccount) throw Error;
//     console.log("get current account", currentAccount);

//     const currentUser = await databases.listDocuments(
//       config.databaseId,
//       config.userCollectionId,
//       [Query.equal("accoundId", currentAccount.$id)]
//     );
//     if (!currentUser) throw Error;

//     return currentUser.documents[0];
//   } catch (error) {
//     throw new Error();
//   }
// };

// export const getAllPosts = async () => {
//   try {
//     const posts = await databases.listDocuments(
//       config.databaseId,
//       config.videoCollectionId,
//       [Query.orderDesc("$createdAt")]
//     );
//     return posts.documents;
//   } catch (error) {
//     throw new Error(error);
//   }
// };
// export const getLatestPosts = async () => {
//   try {
//     const posts = await databases.listDocuments(
//       config.databaseId,
//       config.videoCollectionId,
//       [Query.orderDesc("$createdAt", Query.limit(7))]
//     );
//     return posts.documents;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// export const searchPosts = async (query) => {
//   try {
//     const posts = await databases.listDocuments(
//       config.databaseId,
//       config.videoCollectionId,
//       [Query.search("title", query)]
//     );
//     return posts.documents;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// export const getUserPosts = async (userId) => {
//   try {
//     const posts = await databases.listDocuments(
//       config.databaseId,
//       config.videoCollectionId,
//       [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
//     );
//     return posts.documents;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// export const signOut = async () => {
//   try {
//     const session = await account.deleteSession("current");
//     return session;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// export const getFilePreview = async (fileId, type) => {
//   let fileUrl;

//   try {
//     if (type === "video") {
//       fileUrl = storage.getFileView(config.storageId, fileId);
//     } else if (type === "image") {
//       fileUrl = storage.getFilePreview(
//         config.storageId,
//         fileId,
//         2000,
//         2000,
//         "top",
//         100
//       );
//     } else {
//       throw new Error("Invalid file type");
//     }

//     if (!fileUrl) throw Error;

//     return fileUrl;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// export const uploadFile = async (file, type) => {
//   if (!file) return;

//   const asset = {
//     name: file.fileName,
//     type: file.mimeType,
//     size: file.fileSize,
//     uri: file.uri,
//   };

//   try {
//     const uploadedFile = await storage.createFile(
//       config.storageId,
//       ID.unique(),
//       asset
//     );

//     const fileUrl = await getFilePreview(uploadedFile.$id, type);

//     return fileUrl;
//   } catch {
//     throw new Error(error);
//     // console.log("upload File", error)
//   }
// };

// export const createVideo = async (form) => {
//   try {
//     const [thumbnailUrl, videoUrl] = await Promise.all([
//       uploadFile(form.thumbnail, "image"),
//       uploadFile(form.video, "video"),
//     ]);
//     console.log("video and thumbnail uploaded");
//     const newPost = await databases.createDocument(
//       config.databaseId,
//       config.videoCollectionId,
//       ID.unique(),
//       {
//         title: form.title,
//         thumbnail: thumbnailUrl,
//         video: videoUrl,
//         prompt: form.prompt,
//         creator: form.userId,
//       }
//     );
//     return newPost;
//   } catch (error) {
//     throw new Error(error);
//     // console.log("not upload", error)
//   }
// };

// export const deletePost = async (postId) => {
//   try {
//     const deletedPost = await databases.deleteDocument(
//       config.databaseId,
//       config.videoCollectionId,
//       postId
//     );
//     return deletedPost;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

