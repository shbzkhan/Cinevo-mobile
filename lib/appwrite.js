import { 
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query, 
  Storage
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "66d33ae9001d097140f8",
  databaseId: "66d33e8000342f09ddfe",
  userCollectionId: "66d33eed00028b47662c",
  videoCollectionId: "66d33f24002f9336f3fa",
  storageId: "66d343dc0002051d16cd",
};

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client)

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accoundId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async(email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session
  } catch (error) {
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error
        console.log("get current account", currentAccount)

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal("accoundId", currentAccount.$id)]
        )
        if(!currentUser) throw Error

        return currentUser.documents[0]
    } catch (error) {
        throw new Error;
        
    }

}

export const getAllPosts = async () =>{
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    )
    return posts.documents
  } catch (error) {
    throw new Error(error);
  }
}
export const getLatestPosts = async () =>{
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    )
    return posts.documents
  } catch (error) {
    throw new Error(error);
  }
}

export const searchPosts = async (query) =>{
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    )
    return posts.documents
  } catch (error) {
    throw new Error(error);
  }
}

export const getUserPosts = async (userId) =>{
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    )
    return posts.documents
  } catch (error) {
    throw new Error(error);
  }
}

export const signOut = async ()=>{
  try {
    const session = await account.deleteSession("current")
    return session
  } catch (error) {
    throw new Error(error)    
  }
}

export const getFilePreview = async(fileId, type) =>{
let fileUrl

try {
  if(type === "video"){
    fileUrl = storage.getFileView(config.storageId, fileId)
  }else if(type === "image"){
    fileUrl = storage.getFilePreview(config.storageId, fileId,2000, 2000, "top", 100)
  }else{
    throw new Error("Invalid file type")
  }

  if(!fileUrl) throw Error

  return fileUrl;

} catch (error) {
  throw new Error(error)
}
}

export const uploadFile = async (file, type) =>{
  if(!file) return;

  const asset = {
    name:file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri
  };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    )

    const fileUrl = await getFilePreview(uploadedFile.$id, type)

    return fileUrl;
  } catch{
    throw new Error(error)
    // console.log("upload File", error)
  }
}

export const createVideo = async (form) =>{
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);
    console.log("video and thumbnail uploaded")
    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(), 
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId
      }
    )
    return newPost
  } catch (error) {
    throw new Error(error);
    // console.log("not upload", error)
  }
}
