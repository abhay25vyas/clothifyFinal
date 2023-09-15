import { AuthType, createClient } from 'webdav';
import sharp from 'sharp';

const client = createClient('https://store-av1rbh4a.mybigcommerce.com/dav', {
  authType: AuthType.Digest,
  username: 'catalinbombea@yahoo.com',
  password: '85cd66e4980babc84b3997f023da291e',
});

export const uploadProductImageTowebDav = async (file) => {
  try {
    const folderPath = `/content/All_Images2/AnneatHome`;

    const folderRes = await createFolderWebDav(folderPath);

    const newFile = await convertToPng(file);

    if (folderRes) {
      const remoteFilePath = `${folderPath}/${newFile.originalname}`; // Specify the desired remote filename

      const uploadCheck = await client.putFileContents(
        remoteFilePath,
        file.buffer
      );
      let serverFilePath = '';
      if (uploadCheck) {
        serverFilePath = 'https://www.knobs.co' + remoteFilePath;
        console.log('uploaded File Path on server : ', serverFilePath);
      }

      return serverFilePath;
    }
    return false;
  } catch (error) {
    console.error('Error upload Webdav:', error);
    return false;
  }
};

const createFolderWebDav = async (folderPath) => {
  try {
    // Check if the folder already exists
    const exists = await client.exists(folderPath);
    if (exists) {
      console.error('Folder already exists on the WebDAV server');
      return true;
    }

    // Create the folder
    await client.createDirectory(folderPath);
    console.log('Folder created successfully');
    return true;
  } catch (error) {
    console.error('Error:', error);
  }
};

const convertToPng = async (file) => {
  const inputFileFormat = file.originalname.split('.').pop().toLowerCase();

  if (inputFileFormat !== 'png') {
    // Input image is not in PNG format, so we need to convert it
    return sharp(file.buffer)
      .toFormat('png')
      .toBuffer()
      .then((outputBuffer) => {
        file.buffer = outputBuffer;
        file.originalname = file.originalname.split('.')[0] + '.png';
        file.mimetype = 'image/png';

        return file;
      })
      .catch((error) => {
        console.error('Error converting image:', error);
        return file;
      });
  } else {
    return file;
  }
};
