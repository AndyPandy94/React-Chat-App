import React, { useState, useEffect } from 'react';
import PubNub from 'pubnub';
import { PubNubProvider, usePubNub } from 'pubnub-react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

const pubnub = new PubNub({
  publishKey: 'pub-c-c71b4127-a915-4da6-b760-beb5e3b3474b',
  subscribeKey: 'sub-c-bcc7f940-1fc5-11ec-8d5d-a65b09ab59bc',
  uuid: 'myUniqueUUID'
});

function App() {
  return (
    <PubNubProvider client={pubnub}>
      <Chat />
    </PubNubProvider>
    <Chat channel="channel">
      <MessageList enableReactions reactionsPicker={<Picker />} />
      <MessageInput typingIndicator emojiPicker={<Picker />} />
    </Chat
  );
}




    function Chat() {
      const pubnub = usePubNub();
      const [channels] = useState(['awesome-channel']);
      const [messages, addMessage] = useState([]);
      const [message, setMessage] = useState('');

      const handleMessage = event => {
        const message = event.message;
        if (typeof message === 'string' || message.hasOwnProperty('text')) {
          const text = message.text || message;
          addMessage(messages => [...messages, text]);
        }
      };

const sendMessage = message => {
      pubnub.publish({
        channel: 'awesome-channel',
        message
      })
        .then(() => setMessage(''));
  // handle status, response
};


      useEffect(() => {
        pubnub.addListener({ message: handleMessage });
        pubnub.subscribe({ channels });
          const channelName = message.channel;
          const channelGroup = message.subscription;
          const publishTimetoken = message.timetoken;
          // const msg = message.message;
          const publisher = message.publisher;

          //show time
          const unixTimestamp = message.timetoken / 10000000;
          const gmtDate = new Date(unixTimestamp * 1000);
          const localeDateTime = gmtDate.toLocaleString();
      }, [pubnub, channels]);


      return (
        <div style={pageStyles}>
          <div style={chatStyles}>
            <div style={headerStyles}>Chat</div>
            <div style={listStyles}>
              {messages.map((message, index) => {
                return (
                  <div key={`message-${index}`} style={messageStyles}>
                    {message}
                  </div>
                );
              })}
            </div>
            <div style={footerStyles}>


              <input
                type="text"
                style={inputStyles}
                placeholder="Type your message"
                value={message}
                onKeyPress={e => {
                  if (e.key !== 'Enter') return;
                  sendMessage(message);
                }}
                onChange={e => setMessage(e.target.value)}
              />
              <button title="Add an emoji"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill="currentColor" fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM5 8a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zM5.32 9.636a.75.75 0 011.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 111.222.87l-.614-.431c.614.43.614.431.613.431v.001l-.001.002-.002.003-.005.007-.014.019a1.984 1.984 0 01-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.32 3.32 0 01-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 01.183-1.044h.001z"></path></svg></button>
              <button
                style={buttonStyles}
                onClick={e => {
                  e.preventDefault();
                  sendMessage(message);
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      );
    }

    const pageStyles = {
      alignItems: 'center',
      background: '#282c34',
      display: 'flex',
      justifyContent: 'center',
      minHeight: '100vh',
    };

    const chatStyles = {
      display: 'flex',
      flexDirection: 'column',
      height: '50vh',
      width: '50%',
    };

    const headerStyles = {
      background: '#323742',
      color: 'white',
      fontSize: '1.4rem',
      padding: '10px 15px',
    };

    const listStyles = {
      alignItems: 'flex-start',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      overflow: 'auto',
      padding: '10px',
    };

    const messageStyles = {
      backgroundColor: '#eee',
      borderRadius: '5px',
      color: '#333',
      fontSize: '1.1rem',
      margin: '5px',
      padding: '8px 15px',
    };

    const footerStyles = {
      display: 'flex',
    };

    const inputStyles = {
      flexGrow: 1,
      fontSize: '1.1rem',
      padding: '10px 15px',
    };

    const buttonStyles = {
      fontSize: '1.1rem',
      padding: '10px 15px',
    };

    export default App;
