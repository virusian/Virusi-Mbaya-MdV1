
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { removeBackgroundFromImageFile } from 'remove.bg';

const tourl = async (m, gss) => {
 // const prefixMatch = m.body.match(/^[\\/!#.]/);
   const prefixMatch = m.body.match(/^[+×÷=/_<>[\]!@#.£%^&*()\-"'1234567890?,°€£^:;?¿‽】〕」』【〔「『<>_${}\|`《○♡○¡☆《●●■◇¡¤▪︎•°~♡●♧₩$€○》☆¡Abcdefghijklmonpqrstuvwxyz]/i); 
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const validCommands = ['removebg', 'rmbg', 'nobg'];

  if (validCommands.includes(cmd)) {
    const apiKeys = [
      'q61faXzzR5zNU6cvcrwtUkRU', 'S258diZhcuFJooAtHTaPEn4T',
      '5LjfCVAp4vVNYiTjq9mXJWHF', 'aT7ibfUsGSwFyjaPZ9eoJc61',
      'BY63t7Vx2tS68YZFY6AJ4HHF', '5Gdq1sSWSeyZzPMHqz7ENfi8',
      '86h6d6u4AXrst4BVMD9dzdGZ', 'xp8pSDavAgfE5XScqXo9UKHF',
      'dWbCoCb3TacCP93imNEcPxcL'
    ];
    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

    if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
      return m.reply(`> Send/Reply with an image for remove you picture backgroud\n*Example ${prefix + cmd}*`);
    }

    const localFilePath = `./gifted/remobg-${uuidv4()}`;
    const outputFilePath = `./gifted/hremo-${uuidv4()}.png`;
    const media = await m.quoted.download();

    fs.writeFileSync(localFilePath, media);

    m.reply('*Please Wait, Processing...*');

    removeBackgroundFromImageFile({
      path: localFilePath,
      apiKey,
      size: 'regular',
      type: 'auto',
      scale: '100%',
      outputFile: outputFilePath
    }).then(async () => {
      gss.sendMessage(m.from, { image: fs.readFileSync(outputFilePath), caption: `> Hey ${m.pushName} Your picture Background Romoved Sucessfully` }, { quoted: m });
      fs.unlinkSync(localFilePath);
      fs.unlinkSync(outputFilePath);
    }).catch(error => {
      console.error('Error processing image:', error);
      m.reply('There was an error processing the image.');
      fs.unlinkSync(localFilePath);
    });
  }
};

export default tourl;
