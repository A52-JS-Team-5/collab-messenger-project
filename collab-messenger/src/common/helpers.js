import { ref, list, getStorage, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const isEmailValid = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

export const isPhoneNumberValid = (number) => {
  const numberRegex = /^\d+$/;
  return numberRegex.test(number);
}

export const getUploadedFilesInChannel = (channelId) => {
  const storageRef = ref(storage, `channel_uploads/${channelId}`);

  return list(storageRef, { maxResults: 10 })
    .then((result) => {
      const uploads = result.items;
      const downloadUrls = uploads.map(item => {
      return getDownloadURL(ref(storage, item._location.path_))
        .then((url) => ({
          fileName: item._location.path_.split('/').pop(),
          'url': url 
        }))
          .catch(e => console.log('Error getting download URL for file: ', e.message))
        })
  
      return Promise.all(downloadUrls)
        
      })
    .catch((e) => console.log(e.message));
}

export const getUploadedFilesInChat = (chatId) => {
  const storageRef = ref(storage, `chat_uploads/${chatId}`);

    return list(storageRef, { maxResults: 10 })
      .then((result) => {
        const uploads = result.items;

        const downloadUrls = uploads.map(item => {
          return getDownloadURL(ref(storage, item._location.path_))
            .then((url) => ({
              fileName: item._location.path_.split('/').pop(),
              'url': url
            }))
            .catch(e => console.log('Error getting download URL for file: ', e.message))
        })

        return Promise.all(downloadUrls)
      })
      .catch((e) => console.log(e.message));
}
