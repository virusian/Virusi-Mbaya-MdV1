
import axios from 'axios';
import pkg, { prepareWAMessageMedia } from 'gifted-baileys';
const { generateWAMessageFromContent, proto } = pkg;

const time = async (m, Gifted) => {
  // const prefixMatch = m.body.match(/^[\\/!#.]/);
   const prefixMatch = m.body.match(/^[+×÷=/_<>[\]!@#.£%^&*()\-"'1234567890?,°€£^:;?¿‽】〕」』【〔「『<>_${}\|`《○♡○¡☆《●●■◇¡¤▪︎•°~♡●♧₩$€○》☆¡Abcdefghijklmonpqrstuvwxyz]/i); 
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['time', 'timenow'];

  if (validCommands.includes(cmd)) {
    if (!text) return m.reply(`Hello *_${m.pushName}_,*\n Please provide a Country code after the command ie *.time KE*`);

    try {
      await m.React('🕘');

      const apiUrl = `https://levanter.onrender.com/time?code=${encodeURIComponent(text)}`;
      const response = await axios.get(apiUrl);
      const result = response.data;

      if (result && result.result) {
        const country = result.result[0].name;
        const timezone = result.result[0].timeZone;
        const answer = result.result[0].time;
        
        // Check if the answer contains code
        const codeMatch = answer.match(/```([\s\S]*?)```/);
        
        if (codeMatch) {
          const code = codeMatch[1];
          
          let msg = generateWAMessageFromContent(m.from, {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: answer
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "> *VIRUSI-MD V2*"
                  }),
                  header: proto.Message.InteractiveMessage.Header.create({
                    title: "",
                    subtitle: "",
                    hasMediaAttachment: false
                  }),
                  nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                      {
                        name: "cta_copy",
                        buttonParamsJson: JSON.stringify({
                          display_text: "Copy Your Code",
                          id: "copy_code",
                          copy_code: code
                        })
                      }
                    ]
                  })
                })
              }
            }
          }, {});

          await Gifted.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id
          });
        } else {
          await Gifted.sendMessage(m.from, { text: ` Hello *_${m.pushName}_,*\n Here are Current Time In *${country}* Stats...\n *Date & Time:* ${answer}\n *Timezone:* ${timezone}\n\n> VIRUSI-MD V2` }, { quoted: m });
        }

        await m.React('✅');
      } else {
        throw new Error('Invalid response from the Gifted API.');
      }
    } catch (error) {
      console.error('Error getting Gifted APi response:', error.message);
      m.reply('Error getting response from Gifted APi.');
      await m.React('❌');
    }
  }
};

export default time;
